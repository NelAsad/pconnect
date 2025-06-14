// -----------------------------------------------------------------------------
// Service d'envoi d'emails (OTP, notifications)
// Utilise le module Mailer de NestJS pour envoyer des emails transactionnels
// Fournit des méthodes pour l'envoi d'OTP et de notifications personnalisées
// -----------------------------------------------------------------------------
import * as path from 'path';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  /**
   * Envoie un email contenant un OTP à l'utilisateur
   * @param email Adresse email du destinataire
   * @param otp Code OTP à envoyer
   */
  async sendOtp(email: string, otp: string): Promise<void> {
    this.logger.log(`Envoi OTP ${otp} à ${email}`);

    // Résout le chemin absolu du template, compatible dev et prod
    const templatePath = path.resolve(process.cwd(), 'templates', 'otp');

    await this.mailerService.sendMail({
      to: email,
      subject: 'Votre code de validation',
      template: templatePath,
      context: {
        otp,
      },
    });
  }

  /**
   * Envoie un email de renvoi d'OTP à l'utilisateur
   * @param email Adresse email du destinataire
   * @param otp Code OTP à envoyer
   */
  async sendResendOtp(email: string, otp: string): Promise<void> {
    this.logger.log(`Renvoi OTP ${otp} à ${email}`);
    const templatePath = path.resolve(process.cwd(), 'templates', 'resend-otp');
    await this.mailerService.sendMail({
      to: email,
      subject: 'Renvoi de votre code de validation',
      template: templatePath,
      context: { otp },
    });
  }
}
