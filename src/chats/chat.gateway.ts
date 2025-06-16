import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageEntity } from './entities/message.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * Gateway WebSocket pour la messagerie temps réel (Socket.IO).
 * Gère la connexion/authentification des clients, la réception et l'émission des messages en temps réel.
 * Utilise des rooms par utilisateur pour le routage ciblé des messages et notifications.
 */
@WebSocketGateway({ cors: true })
@Injectable()
export class ChatGateway {
  /**
   * Instance du serveur Socket.IO.
   */
  @WebSocketServer()
  server: Server;

  /**
   * Injection des services métier et JWT.
   */
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Événement WebSocket pour l'envoi d'un message privé.
   * Persiste le message et l'émet en temps réel au destinataire (room = userId).
   * @param data Données du message à envoyer
   * @param client Socket du client émetteur
   */
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: Partial<MessageEntity>,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.create(data);
    // Émettre le message uniquement au destinataire (room = userId)
    if (message.receiver?.id) {
      this.server.to(`user_${message.receiver.id}`).emit('new_message', message);
    }
    // (Optionnel) Accusé d'envoi au sender (pas de broadcast)
    return message;
  }

  /**
   * Gestion de la connexion d'un client WebSocket.
   * Authentifie le client via JWT (header Authorization), puis l'abonne à sa room personnelle.
   * Émet un événement de connexion à la room de l'utilisateur.
   * @param client Socket du client connecté
   */
  handleConnection(client: Socket) {
    // Récupérer le JWT dans les headers (Authorization: Bearer ...)
    let authHeader =
      client.handshake.headers['authorization'] ||
      client.handshake.headers['Authorization'];
    if (Array.isArray(authHeader)) {
      authHeader = authHeader[0];
    }
    if (
      !authHeader ||
      typeof authHeader !== 'string' ||
      !authHeader.startsWith('Bearer ')
    ) {
      client.disconnect();
      return;
    }
    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      // Authentification OK, on peut attacher l'userId à la socket
      client.data.userId = payload.sub;
      client.join(`user_${payload.sub}`);
      this.server
        .to(`user_${payload.sub}`)
        .emit('user_connected', { userId: payload.sub });
    } catch (e) {
      client.disconnect();
    }
  }

  /**
   * Gestion de la déconnexion d'un client WebSocket.
   * Émet un événement de déconnexion à la room de l'utilisateur (optionnel).
   * @param client Socket du client déconnecté
   */
  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      // Optionnel : log ou notification de déconnexion
      this.server.to(`user_${userId}`).emit('user_disconnected', { userId });
    }
  }
}
