import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './entities/message.entity';
import { FirebaseService } from './firebase.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

/**
 * Service métier pour la gestion de la messagerie privée (chat).
 * Centralise la logique d'accès aux messages, pagination, notifications push et gestion des conversations.
 * Utilise TypeORM pour l'accès à la base de données et Firebase pour les notifications FCM.
 */
@Injectable()
export class ChatService {
  /**
   * Injection des repositories TypeORM et du service Firebase.
   */
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly firebaseService: FirebaseService,
  ) {}

  /**
   * Crée un nouveau message en base et envoie une notification push FCM au destinataire si possible.
   * @param data Données du message à créer
   */
  async create(data: Partial<MessageEntity>): Promise<MessageEntity> {
    const message = this.messageRepository.create(data);
    const saved = await this.messageRepository.save(message);

    // Récupérer le fcmToken du destinataire et envoyer la notification push si disponible
    if (data.receiver && (data.receiver as any).id) {
      const receiver = await this.userRepository.findOne({ where: { id: (data.receiver as any).id } });
      if (receiver?.fcmToken) {
        await this.firebaseService.sendPushNotification(receiver.fcmToken, {
          notification: {
            title: 'Nouveau message',
            body: data.content?.slice(0, 100) || 'Vous avez reçu un nouveau message',
          },
          data: {
            messageId: saved.id.toString(),
          },
        } as any);
      }
    }
    return saved;
  }

  /**
   * Récupère tous les messages (non paginés), avec relations principales.
   */
  async findAll(): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      relations: ['sender', 'receiver', 'announcement', 'attachments'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Récupère les messages paginés (avec relations), triés par date de création.
   * @param page Page courante
   * @param limit Nombre d'éléments par page
   */
  async findAllPaginated(page = 1, limit = 10): Promise<Pagination<MessageEntity>> {
    const options: IPaginationOptions = { page, limit };
    const queryBuilder = this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .leftJoinAndSelect('message.announcement', 'announcement')
      .leftJoinAndSelect('message.attachments', 'attachments')
      .orderBy('message.createdAt', 'DESC');
    return paginate<MessageEntity>(queryBuilder, options);
  }

  /**
   * Récupère un message par son identifiant, avec relations.
   * @param id Identifiant du message
   * @throws NotFoundException si le message n'existe pas
   */
  async findOne(id: number): Promise<MessageEntity> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'announcement', 'attachments'],
    });
    if (!message) throw new NotFoundException('Message non trouvé');
    return message;
  }

  /**
   * Met à jour un message existant.
   * @param id Identifiant du message
   * @param data Données à mettre à jour
   */
  async update(id: number, data: Partial<MessageEntity>): Promise<MessageEntity> {
    const message = await this.findOne(id);
    Object.assign(message, data);
    return this.messageRepository.save(message);
  }

  /**
   * Supprime définitivement un message de la base.
   * @param id Identifiant du message
   */
  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);
    await this.messageRepository.remove(message);
  }

  /**
   * Récupère la conversation paginée entre deux utilisateurs (userA, userB).
   * Les messages sont triés par date de création décroissante.
   * @param userAId Id utilisateur A
   * @param userBId Id utilisateur B
   * @param page Page de pagination
   * @param limit Nombre d'éléments par page
   */
  async findConversationPaginated(userAId: number, userBId: number, page = 1, limit = 10) {
    const options: IPaginationOptions = { page, limit };
    const queryBuilder = this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .leftJoinAndSelect('message.announcement', 'announcement')
      .leftJoinAndSelect('message.attachments', 'attachments')
      .where(
        '(message.sender = :userA AND message.receiver = :userB) OR (message.sender = :userB AND message.receiver = :userA)',
        { userA: userAId, userB: userBId }
      )
      .orderBy('message.createdAt', 'DESC');
    return paginate<MessageEntity>(queryBuilder, options);
  }
}
