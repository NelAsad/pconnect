// -----------------------------------------------------------------------------
// Stratégie JWT-refresh pour l'authentification par refresh token
// Valide le refresh token stocké en cookie httpOnly et charge l'utilisateur
// Utilisé pour rafraîchir les tokens d'accès de manière sécurisée
// -----------------------------------------------------------------------------
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refresh_token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  /**
   * Valide le refresh token et charge l'utilisateur associé
   * @param req Requête HTTP contenant le cookie
   * @param payload Données extraites du token
   * @returns L'utilisateur authentifié si le token est valide
   * @throws UnauthorizedException si le token est manquant ou invalide
   */
  async validate(req: Request, payload: any): Promise<UserEntity> {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('Token d’actualisation manquant');

    const user = await this.authService.validateRefreshToken(payload.sub, refreshToken);

    if (!user) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    return user;
  }
}
