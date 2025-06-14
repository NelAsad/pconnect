// src/users/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { UserOtpEntity } from './entities/user-otp.entity';
import { MailService } from 'src/common/mail/mail.service';
import { CityEntity } from 'src/geography/entities/city.entity';

// -----------------------------------------------------------------------------
// Module utilisateur
// Déclare les entités, services et contrôleurs liés à la gestion des utilisateurs.
// À importer dans AppModule pour exposer les fonctionnalités utilisateurs à l'application.
// -----------------------------------------------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity, UserOtpEntity, CityEntity])],
  controllers: [UserController],
  providers: [UserService, MailService],
  exports: [UserService],
})
export class UserModule {}
