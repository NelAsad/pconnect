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

  /**
   * Envoie un email à l'utilisateur pour l'informer que sa communauté est en attente de validation
   * @param email Adresse email du créateur
   * @param community Nom de la communauté
   * @param user Nom du créateur
   */
  async sendCommunityPending(email: string, community: string, user: string): Promise<void> {
    this.logger.log(`Notification création communauté en attente : ${community} (${email})`);
    const templatePath = path.resolve(process.cwd(), 'templates', 'community-pending');
    await this.mailerService.sendMail({
      to: email,
      subject: `Votre communauté "${community}" est en attente de validation`,
      template: templatePath,
      context: { community, user },
    });
  }

  /**
   * Envoie un email à l'utilisateur pour l'informer que sa coandidature pour integrer une communauté est en attente de validation
   * @param email Adresse email du créateur
   * @param community Nom de la communauté
   * @param user Nom du créateur
   */
  async sendUserCommunityPending(email: string, community: string, user: string): Promise<void> {
    this.logger.log(`Notification integration à la communauté en attente : ${community} (${email})`);
    const templatePath = path.resolve(process.cwd(), 'templates', 'user-community-pending');
    await this.mailerService.sendMail({
      to: email,
      subject: `Votre demande d'integrer la communauté "${community}" est en attente de validation`,
      template: templatePath,
      context: { community, user },
    });
  }

  /**
   * Envoie un email à l'utilisateur pour l'informer que sa coandidature pour integrer une communauté est accpetée
   * @param email Adresse email du créateur
   * @param community Nom de la communauté
   * @param user Nom du créateur
   */
  async sendUserCommunityAccepted(email: string, community: string, user: string): Promise<void> {
    this.logger.log(`Notification integration à la communauté acceptée : ${community} (${email})`);
    const templatePath = path.resolve(process.cwd(), 'templates', 'user-community-accepted');
    await this.mailerService.sendMail({
      to: email,
      subject: `Membre de la communauté "${community}" !`,
      template: templatePath,
      context: { community, user },
    });
  }

  /**
   * Envoie un email à l'utilisateur pour l'informer que sa coandidature pour integrer une communauté est rejetée
   * @param email Adresse email du créateur
   * @param community Nom de la communauté
   * @param user Nom du créateur
   */
  async sendUserCommunityRejected(email: string, community: string, user: string): Promise<void> {
    this.logger.log(`Notification integration à la communauté rejetée : ${community} (${email})`);
    const templatePath = path.resolve(process.cwd(), 'templates', 'user-community-rejected');
    await this.mailerService.sendMail({
      to: email,
      subject: `Candidature à la communauté "${community}" !`,
      template: templatePath,
      context: { community, user },
    });
  }

  /**
   * Envoie une invitation à rejoindre une communauté
   * @param email Adresse email de l'invité
   * @param communityName Nom de la communauté
   * @param token Token d'invitation
   */
  async sendCommunityInvitation(email: string, communityName: string, token: string): Promise<void> {
    this.logger.log(`Envoi invitation à ${email} pour la communauté ${communityName}`);
    const invitationLink = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/communities/invitations/${token}/accept`;
    const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toLocaleDateString();
    const templatePath = path.resolve(process.cwd(), 'templates', 'community-invitation');
    await this.mailerService.sendMail({
      to: email,
      subject: `Invitation à rejoindre la communauté "${communityName}"`,
      template: templatePath,
      context: {
        communityName,
        invitationLink,
        expirationDate,
      },
    });
  }
}
