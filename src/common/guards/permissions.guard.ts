// src/common/guards/permissions.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Récupère les permissions requises depuis le décorateur
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // Aucune permission requise
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;

    if (!user) {
      throw new ForbiddenException('Utilisateur non authentifié.');
    }

    // Permissions issues du rôle
    const rolePermissions = user.role?.permissions?.map(p => p.name) || [];

    // Permissions assignées directement à l'utilisateur
    const directPermissions = user.permissions?.map(p => p.name) || [];

    // Fusionner et dédupliquer les permissions
    const allPermissions = new Set([...rolePermissions, ...directPermissions]);

    const hasAllPermissions = requiredPermissions.every(p =>
      allPermissions.has(p),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException('Permissions insuffisantes.');
    }

    return true;
  }
}
