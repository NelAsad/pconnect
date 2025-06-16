import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Valeur de la note (de 1 à 5).
   */
  @Column({ type: 'int', width: 1 })
  note: number; // de 1 à 5

  /**
   * Commentaire associé à la note (optionnel).
   */
  @Column('text', { nullable: true })
  comment: string;

  /**
   * Date de création de la note (auto-générée).
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Date de dernière modification de la note (auto-générée).
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Utilisateur émetteur de la note (auteur).
   */
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  /**
   * Utilisateur destinataire de la note (noté).
   */
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  /**
   * Annonce concernée par la note (contexte de l'évaluation).
   */
  @ManyToOne(() => AnnouncementEntity, { eager: true })
  @JoinColumn({ name: 'announcement_id' })
  announcement: AnnouncementEntity;
}
