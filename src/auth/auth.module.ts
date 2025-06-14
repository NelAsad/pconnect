// Module d'authentification centralisant la gestion des tokens, stratégies JWT et endpoints liés à l'auth
// Fournit les services, contrôleurs et stratégies nécessaires à l'authentification JWT et refresh
// Importe les entités User, Role, Permission pour la gestion des droits
// Utilise Passport et JwtModule pour la sécurité
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/refresh.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserModule } from 'src/users/user.module';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity]),
    UserModule,
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
