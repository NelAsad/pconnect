// src/auth/auth.service.ts
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    /**
     * Génère un accessToken et un refreshToken pour un utilisateur donné
     */
    async getTokens(userId: string, email: string): Promise<{ accessToken: string; refreshToken: string }> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email },
                {
                    secret: process.env.JWT_ACCESS_SECRET,
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                { sub: userId, email },
                {
                    secret: process.env.JWT_REFRESH_SECRET,
                    expiresIn: '7d',
                },
            ),
        ]);

        return { accessToken, refreshToken };
    }

    /**
     * Authentifie un utilisateur à partir de son email et mot de passe
     * Retourne les tokens si succès
     */
    async login(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email); // Implémente findByEmail dans UserService

        if (!user) throw new ForbiddenException('Email ou mot de passe incorrect');

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) throw new ForbiddenException('Email ou mot de passe incorrect');

        const tokens = await this.getTokens(String(user.id), user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    /**
     * Inscrit un nouvel utilisateur et retourne ses tokens
     */
    async register(dto: RegisterDto) {
        // Utilise le UserService pour créer l'utilisateur
        const user = await this.userService.create(dto);
        // Génère les tokens
        const tokens = await this.getTokens(String(user.id), user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    /**
     * Met à jour le refresh token hashé pour un utilisateur (ou le révoque si null)
     */
    async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await this.userService.update(userId, {
            hashedRefreshToken,
        });
    }

    /**
     * Valide un refresh token et retourne l'utilisateur si valide
     */
    async validateRefreshToken(userId: number, refreshToken: string): Promise<UserEntity | null> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['role', 'role.permissions', 'permissions',], // toutes les relations utiles
        });

        if (!user || !user.hashedRefreshToken) return null;

        const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!isMatch) return null;

        return user; // ici, il a toutes les permissions nécessaires
    }

    /**
     * Change le mot de passe d'un utilisateur après vérification de l'ancien
     * Révoque le refresh token après changement
     */
    async changePassword(userId: number, oldPassword: string, newPassword: string) {
        const user = await this.userService.findOneById(String(userId));
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new ForbiddenException('Ancien mot de passe incorrect');
        user.password = await bcrypt.hash(newPassword, 10);
        user.hashedRefreshToken = null; // Révoque le refresh token
        await this.userService.update(userId, { password: user.password, hashedRefreshToken: null });
        return { message: 'Mot de passe changé. Veuillez vous reconnecter.' };
    }

}
