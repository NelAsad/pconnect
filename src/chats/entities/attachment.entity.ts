import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MessageEntity } from './message.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Entité représentant une pièce jointe associée à un message privé.
 * Permet de stocker l'URL du fichier, son type (image, doc, etc.) et le lien avec le message parent.
 * Les pièces jointes sont supprimées en cascade si le message parent est supprimé.
 */
@Entity('attachments')
export class AttachmentEntity {
  /**
   * Identifiant unique de la pièce jointe (clé primaire).
   */
  @ApiProperty({ description: 'Identifiant unique de la pièce jointe', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * URL d'accès à la ressource stockée (fichier, image, etc.).
   */
  @ApiProperty({ description: 'URL d’accès à la ressource stockée', example: '/uploads/file.pdf' })
  @Column()
  url: string;

  /**
   * Type MIME ou extension du fichier (optionnel).
   */
  @ApiPropertyOptional({ description: 'Type MIME ou extension du fichier', example: 'image/png' })
  @Column({ nullable: true })
  type?: string;

  /**
   * Référence au message parent (relation N:1).
   */
  @ApiProperty({ description: 'Message parent', type: () => MessageEntity })
  @ManyToOne(() => MessageEntity, message => message.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: MessageEntity;
}
