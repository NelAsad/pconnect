import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { AnnouncementEntity } from 'src/announcements/entities/announcement.entity';

/**
 * Enumération des types de cible d'un signalement (utilisateur ou annonce).
 */
export enum ReportTargetType {
  USER = 'USER',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
}

/**
 * Entité représentant un signalement (report) effectué par un utilisateur.
 * Permet de signaler un utilisateur ou une annonce, avec gestion des relations et de l'auteur.
 * Utilisé pour la modération et la gestion des abus sur la plateforme.
 */
@Entity('reports')
export class ReportEntity {
  /**
   * Identifiant unique du signalement (clé primaire).
   */
  @ApiProperty({ example: 1, description: 'Identifiant unique du signalement' })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Type de cible du signalement (utilisateur ou annonce).
   */
  @ApiProperty({ enum: ReportTargetType, description: 'Type de cible du signalement (USER ou ANNOUNCEMENT)' })
  @Column({ type: 'enum', enum: ReportTargetType })
  targetType: ReportTargetType;

  /**
   * Utilisateur signalé (nullable, si cible = USER).
   */
  @ApiPropertyOptional({ type: () => UserEntity, description: 'Utilisateur signalé (si cible = USER)' })
  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'target_user_id' })
  targetUser?: UserEntity;

  /**
   * Annonce signalée (nullable, si cible = ANNOUNCEMENT).
   */
  @ApiPropertyOptional({ type: () => AnnouncementEntity, description: 'Annonce signalée (si cible = ANNOUNCEMENT)' })
  @ManyToOne(() => AnnouncementEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'target_announcement_id' })
  targetAnnouncement?: AnnouncementEntity;

  /**
   * Utilisateur auteur du signalement.
   */
  @ApiProperty({ type: () => UserEntity, description: 'Auteur du signalement' })
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  /**
   * Motif du signalement (obligatoire).
   */
  @ApiProperty({ example: 'Spam', description: 'Motif du signalement' })
  @Column()
  reason: string;

  /**
   * Description détaillée du signalement (optionnelle).
   */
  @ApiPropertyOptional({ example: 'Contenu inapproprié', description: 'Description détaillée du signalement' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Date de création du signalement (auto-générée).
   */
  @ApiProperty({ example: '2024-06-16T12:00:00.000Z', description: 'Date de création du signalement' })
  @CreateDateColumn()
  createdAt: Date;
}
