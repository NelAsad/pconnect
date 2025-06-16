import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Type de cible du signalement (utilisateur ou annonce).
   */
  @Column({ type: 'enum', enum: ReportTargetType })
  targetType: ReportTargetType;

  /**
   * Utilisateur signalé (nullable, si cible = USER).
   */
  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'target_user_id' })
  targetUser?: UserEntity;

  /**
   * Annonce signalée (nullable, si cible = ANNOUNCEMENT).
   */
  @ManyToOne(() => AnnouncementEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'target_announcement_id' })
  targetAnnouncement?: AnnouncementEntity;

  /**
   * Utilisateur auteur du signalement.
   */
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  /**
   * Motif du signalement (obligatoire).
   */
  @Column()
  reason: string;

  /**
   * Description détaillée du signalement (optionnelle).
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Date de création du signalement (auto-générée).
   */
  @CreateDateColumn()
  createdAt: Date;
}
