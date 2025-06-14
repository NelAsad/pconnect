// -----------------------------------------------------------------------------
// Décorateur d'injection de l'utilisateur courant
// Permet de récupérer l'utilisateur authentifié dans les handlers de contrôleur
// Utilisé pour simplifier l'accès à l'utilisateur dans les endpoints sécurisés
// -----------------------------------------------------------------------------
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';

/**
 * Décorateur pour injecter l'utilisateur courant dans un handler de contrôleur
 * @returns L'utilisateur authentifié (UserEntity)
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
