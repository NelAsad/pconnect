import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { AnnouncementEntity } from 'src/announcements/entities/announcement.entity';

/**
 * Entité représentant une note/évaluation (rating) entre utilisateurs.
 * Permet de noter un utilisateur sur une annonce, avec commentaire optionnel.
 * Utilisé pour la réputation, la confiance et la modération sur la plateforme.
 */
@Entity('ratings')
export class RatingEntity {
  /**
   * Identifiant unique de la note (clé primaire).
   */
  @ApiProperty({ example: 1, description: 'Identifiant unique de la note' })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Valeur de la note (de 1 à 5).
   */
  @ApiProperty({ example: 5, minimum: 1, maximum: 5, description: 'Valeur de la note (de 1 à 5)' })
  @Column({ type: 'int', width: 1 })
  note: number; // de 1 à 5

  /**
   * Commentaire associé à la note (optionnel).
   */
  @ApiPropertyOptional({ example: 'Très bon échange', description: 'Commentaire optionnel' })
  @Column('text', { nullable: true })
  comment: string;

  /**
   * Date de création de la note (auto-générée).
   */
  @ApiProperty({ example: '2024-06-16T12:00:00.000Z', description: 'Date de création de la note' })
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Date de dernière modification de la note (auto-générée).
   */
  @ApiProperty({ example: '2024-06-16T12:00:00.000Z', description: 'Date de dernière modification de la note' })
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Utilisateur émetteur de la note (auteur).
   */
  @ApiProperty({ type: () => UserEntity, description: 'Utilisateur émetteur de la note', required: true })
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  /**
   * Utilisateur destinataire de la note (noté).
   */
  @ApiProperty({ type: () => UserEntity, description: 'Utilisateur destinataire de la note', required: true })
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  /**
   * Annonce concernée par la note (contexte de l'évaluation).
   */
  @ApiProperty({ type: () => AnnouncementEntity, description: "Annonce concernée par la note", required: true })
  @ManyToOne(() => AnnouncementEntity, { eager: true })
  @JoinColumn({ name: 'announcement_id' })
  announcement: AnnouncementEntity;
}
