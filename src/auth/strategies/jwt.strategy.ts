// src/auth/strategies/jwt.strategy.ts

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      relations: ['role', 'role.permissions', 'permissions'], // Charger les relations nécessaires
    });

    if (!user) throw new UnauthorizedException('Utilisateur introuvable');

    return user; // Injecté dans request.user
  }
}
