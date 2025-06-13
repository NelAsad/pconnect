// src/users/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
