// -----------------------------------------------------------------------------
// Guard JWT pour l'authentification par access token
// Fournit une gestion centralisée des erreurs d'authentification JWT
// Retourne un message d'erreur générique pour la sécurité
// -----------------------------------------------------------------------------
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Gère la validation de l'utilisateur et les erreurs JWT
   * @param err Erreur potentielle
   * @param user Utilisateur authentifié
   * @param info Informations JWT
   * @param context Contexte d'exécution
   * @returns L'utilisateur si authentifié, sinon lève une exception
   */
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      // Message générique pour la sécurité
      throw new UnauthorizedException('Accès non autorisé');
    }
    return user;
  }
}
