// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

// Contrôleur d'authentification gérant les endpoints publics pour login, inscription, refresh, logout et changement de mot de passe
// Utilise les guards JWT et JWT-refresh pour sécuriser les routes sensibles
// Les cookies httpOnly sont utilisés pour le refresh token
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de connexion utilisateur
   * Retourne un accessToken et place le refreshToken en cookie httpOnly
   */
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto);
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: true, // à activer en production
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });
    return { accessToken: tokens.accessToken };
  }

  /**
   * Endpoint d'inscription utilisateur
   * Retourne un accessToken et place le refreshToken en cookie httpOnly
   */
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.register(dto);
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: true, // à activer en production
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });
    return { accessToken: tokens.accessToken };
  }

  /**
   * Endpoint pour rafraîchir les tokens (nécessite le refreshToken en cookie)
   */
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as any;
    const tokens = await this.authService.getTokens(String(user.id), user.email);
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: true, // à activer en production
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });
    return { accessToken: tokens.accessToken };
  }

  /**
   * Endpoint de déconnexion (révoque le refreshToken)
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.updateRefreshToken(user.id, null); // Révoque le refresh token
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Déconnexion réussie' };
  }

  /**
   * Endpoint pour changer son mot de passe (authentifié)
   * Révoque le refreshToken après changement
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: any,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.changePassword(user.id, oldPassword, newPassword);
    // Révoque le refresh token après changement de mot de passe
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return result;
  }

  // Tu ajouteras d'autres endpoints si nécessaire
}
