// src/users/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UserOtpEntity } from './entities/user-otp.entity';
import { MailService } from 'src/common/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(UserOtpEntity)
    private userOtpRepository: Repository<UserOtpEntity>,

    private mailService: MailService,
  ) {}

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['role', 'role.permissions', 'permissions'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async findByEmail(_email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: _email },
      relations: ['role', 'role.permissions', 'permissions'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async update(userId: number, updateData: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: (userId) } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async create(dto: RegisterDto): Promise<UserEntity> {
    // Vérifie si l'email existe déjà
    const existing = await this.findByEmail(dto.email).catch(() => null);
    if (existing) throw new Error('Email déjà utilisé');

    // Invalide tous les anciens OTP non utilisés pour cet email
    await this.userOtpRepository.update({ email: dto.email, used: false }, { used: true });

    // Génère un OTP à 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Stocke l'OTP en base avec expiration
    await this.userOtpRepository.save({ email: dto.email, otp, expiresAt });

    // Envoie l'OTP par mail
    await this.mailService.sendOtp(dto.email, otp);

    // Création de l'utilisateur en mode inactif
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    let city = undefined;
    if (dto.cityId) city = { id: dto.cityId };
    let role = undefined;
    if (dto.roleId) role = { id: dto.roleId };
    
    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      description: dto.description,
      city,
      role,
      isActive: false,
    });
    return this.userRepository.save(user);
  }

  async validateOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const userOtp = await this.userOtpRepository.findOne({
      where: { email, otp, used: false },
    });
    if (!userOtp) {
      return { success: false, message: 'OTP invalide ou déjà utilisé.' };
    }
    if (userOtp.expiresAt < new Date()) {
      return { success: false, message: 'OTP expiré.' };
    }
    userOtp.used = true;
    await this.userOtpRepository.save(userOtp);
    // Active l'utilisateur si besoin
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && !user.isActive) {
      user.isActive = true;
      await this.userRepository.save(user);
    }
    return { success: true, message: 'OTP validé avec succès.' };
  }

  async resendOtp(email: string): Promise<{ success: boolean; message: string }> {
    // Vérifie si l'utilisateur existe
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return { success: false, message: "Utilisateur non trouvé." };
    }
    // Invalide tous les anciens OTP non utilisés
    await this.userOtpRepository.update({ email, used: false }, { used: true });
    // Génère un nouvel OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.userOtpRepository.save({ email, otp, expiresAt });
    // Envoie l'OTP par mail avec le template adapté
    await this.mailService.sendResendOtp(email, otp);
    return { success: true, message: "OTP renvoyé avec succès." };
  }
}
