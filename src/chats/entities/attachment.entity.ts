import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MessageEntity } from './message.entity';

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
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * URL d'accès à la ressource stockée (fichier, image, etc.).
   */
  @Column()
  url: string;

  /**
   * Type MIME ou extension du fichier (optionnel).
   */
  @Column({ nullable: true })
  type?: string;

  /**
   * Référence au message parent (relation N:1).
   */
  @ManyToOne(() => MessageEntity, message => message.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: MessageEntity;
}
