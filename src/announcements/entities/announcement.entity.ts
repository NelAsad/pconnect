// -----------------------------------------------------------------------------
// Entité AnnouncementEntity
// Représente une annonce publiée par un utilisateur (service ou produit)
// -----------------------------------------------------------------------------
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CommunityEntity } from 'src/communities/entities/community.entity';
import { RatingEntity } from 'src/ratings/entities/rating.entity';

// Enumération du type d'annonce (service ou produit)
export enum AnnouncementType {
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
}

@Entity('announcements')
export class AnnouncementEntity {
  // Identifiant unique de l'annonce
  @PrimaryGeneratedColumn()
  id: number;

  // Titre de l'annonce
  @Column()
  title: string;

  // Description détaillée de l'annonce
  @Column('text')
  description: string;

  // Type d'annonce (service ou produit)
  @Column({ type: 'enum', enum: AnnouncementType })
  type: AnnouncementType;

  // Statut de publication de l'annonce
  @Column({ default: false })
  isPublished: boolean;

  // Liste des images associées à l'annonce (chemins ou URLs)
  @Column('simple-array', { nullable: true })
  images: string[];

  // Date de création de l'annonce
  @CreateDateColumn()
  createdAt: Date;

  // Date de dernière mise à jour de l'annonce
  @UpdateDateColumn()
  updatedAt: Date;

  // Catégorie associée à l'annonce
  @ManyToOne(() => CategoryEntity, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  // Utilisateur ayant publié l'annonce
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  // Communauté liée à l'annonce (optionnel)
  @ManyToOne(() => CommunityEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'community_id' })
  community?: CommunityEntity;

  // Liste des notes/avis associés à l'annonce
  @OneToMany(() => RatingEntity, rating => rating.announcement)
  ratings: RatingEntity[];
}
