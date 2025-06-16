import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

/**
 * Service d'intégration Firebase pour l'envoi de notifications push FCM.
 * Initialise le SDK Firebase Admin à l'initialisation du module.
 * Permet d'envoyer des notifications ciblées aux devices utilisateurs.
 */
@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);

  /**
   * Initialisation du SDK Firebase Admin à l'init du module.
   * Charge la clé de service depuis le fichier de configuration.
   */
  onModuleInit() {
    if (!admin.apps.length) {
      const serviceAccountPath = path.resolve(process.cwd(), 'firebase-adminsdk.json'); // adapte le nom si besoin
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
      this.logger.log('Firebase Admin initialisé');
    }
  }

  /**
   * Retourne l'instance admin Firebase (pour usages avancés).
   */
  getAdmin() {
    return admin;
  }

  /**
   * Envoie une notification push FCM à un device utilisateur.
   * @param token FCM device token
   * @param payload Contenu de la notification (objet Message)
   */
  async sendPushNotification(token: string, payload: admin.messaging.Message) {
    try {
      await admin.messaging().send({
        token,
        ...payload,
      });
      this.logger.log(`Notification envoyée à ${token}`);
    } catch (error) {
      this.logger.error('Erreur envoi notification FCM', error);
    }
  }
}
