import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { AnnouncementEntity } from 'src/announcements/entities/announcement.entity';
import { AttachmentEntity } from './attachment.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty({ description: 'Identifiant unique du message', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Contenu textuel du message.
   */
  @ApiProperty({ description: 'Contenu textuel du message', example: 'Bonjour, je suis intéressé par votre annonce.' })
  @Column('text')
  content: string;

  /**
   * Statut du message (envoyé, délivré, lu).
   */
  @ApiProperty({ enum: MessageStatus, description: 'Statut du message', example: MessageStatus.SENT })
  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.SENT,
  })
  status: MessageStatus;

  /**
   * Date de création du message (auto-générée).
   */
  @ApiProperty({ description: 'Date de création du message', example: '2025-06-16T12:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Utilisateur émetteur du message (relation N:1, eager).
   */
  @ApiProperty({ description: 'Utilisateur émetteur du message', type: () => UserEntity })
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  /**
   * Utilisateur destinataire du message (relation N:1, eager).
   */
  @ApiProperty({ description: 'Utilisateur destinataire du message', type: () => UserEntity })
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  /**
   * Lien optionnel vers une annonce (ex : message lié à une offre).
   */
  @ApiPropertyOptional({ description: 'Annonce liée au message (optionnel)', type: () => AnnouncementEntity })
  @ManyToOne(() => AnnouncementEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'announcement_id' })
  announcement?: AnnouncementEntity;

  /**
   * Liste des pièces jointes associées au message (relation 1:N, cascade).
   */
  @ApiPropertyOptional({ description: 'Pièces jointes associées au message', type: () => [AttachmentEntity] })
  @OneToMany(() => AttachmentEntity, attachment => attachment.message, { cascade: true })
  attachments: AttachmentEntity[];
}
