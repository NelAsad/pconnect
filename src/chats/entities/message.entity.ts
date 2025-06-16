import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { AnnouncementEntity } from 'src/announcements/entities/announcement.entity';
import { AttachmentEntity } from './attachment.entity';

/**
 * Enumération des statuts possibles d'un message (envoyé, délivré, lu).
 * Permet de suivre l'état de livraison/lecture côté messagerie temps réel.
 */
export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

/**
 * Entité représentant un message privé échangé entre deux utilisateurs.
 * Supporte les statuts, la date, les pièces jointes et le lien optionnel à une annonce.
 * Utilisé pour la messagerie temps réel (Socket.IO) et l'historique des conversations.
 */
@Entity('messages')
export class MessageEntity {
  /**
   * Identifiant unique du message (clé primaire).
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Contenu textuel du message.
   */
  @Column('text')
  content: string;

  /**
   * Statut du message (envoyé, délivré, lu).
   */
  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.SENT,
  })
  status: MessageStatus;

  /**
   * Date de création du message (auto-générée).
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Utilisateur émetteur du message (relation N:1, eager).
   */
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  /**
   * Utilisateur destinataire du message (relation N:1, eager).
   */
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  /**
   * Lien optionnel vers une annonce (ex : message lié à une offre).
   */
  @ManyToOne(() => AnnouncementEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'announcement_id' })
  announcement?: AnnouncementEntity;

  /**
   * Liste des pièces jointes associées au message (relation 1:N, cascade).
   */
  @OneToMany(() => AttachmentEntity, attachment => attachment.message, { cascade: true })
  attachments: AttachmentEntity[];
}
