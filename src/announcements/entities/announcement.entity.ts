// -----------------------------------------------------------------------------
// Entité AnnouncementEntity
// Représente une annonce publiée par un utilisateur (service ou produit)
// -----------------------------------------------------------------------------
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CommunityEntity } from 'src/communities/entities/community.entity';
import { RatingEntity } from 'src/ratings/entities/rating.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Enumération du type d'annonce (service ou produit)
export enum AnnouncementType {
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
}

@Entity('announcements')
export class AnnouncementEntity {
  /**
   * Identifiant unique de l'annonce
   */
  @ApiProperty({ description: "Identifiant unique de l'annonce", example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Titre de l'annonce
   */
  @ApiProperty({ description: "Titre de l'annonce", example: "Cours de piano à domicile" })
  @Column()
  title: string;

  /**
   * Description détaillée de l'annonce
   */
  @ApiProperty({ description: "Description détaillée de l'annonce", example: "Je propose des cours de piano pour débutants et intermédiaires..." })
  @Column('text')
  description: string;

  /**
   * Type d'annonce (service ou produit)
   */
  @ApiProperty({ enum: AnnouncementType, description: "Type d'annonce (SERVICE ou PRODUCT)", example: AnnouncementType.SERVICE })
  @Column({ type: 'enum', enum: AnnouncementType })
  type: AnnouncementType;

  /**
   * Statut de publication de l'annonce
   */
  @ApiProperty({ description: "Statut de publication de l'annonce", example: true })
  @Column({ default: false })
  isPublished: boolean;

  /**
   * Liste des images associées à l'annonce (chemins ou URLs)
   */
  @ApiPropertyOptional({ description: "Liste des images associées à l'annonce (chemins ou URLs)", type: [String], example: ["/uploads/img1.jpg", "/uploads/img2.jpg"] })
  @Column('simple-array', { nullable: true })
  images: string[];

  /**
   * Date de création de l'annonce
   */
  @ApiProperty({ description: "Date de création de l'annonce", example: "2025-06-16T12:00:00.000Z" })
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Date de dernière mise à jour de l'annonce
   */
  @ApiProperty({ description: "Date de dernière mise à jour de l'annonce", example: "2025-06-16T12:00:00.000Z" })
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Catégorie associée à l'annonce
   */
  @ApiProperty({ description: "Catégorie associée à l'annonce", type: () => CategoryEntity })
  @ManyToOne(() => CategoryEntity, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  /**
   * Utilisateur ayant publié l'annonce
   */
  @ApiProperty({ description: "Utilisateur ayant publié l'annonce", type: () => UserEntity })
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  /**
   * Communauté liée à l'annonce (optionnel)
   */
  @ApiPropertyOptional({ description: "Communauté liée à l'annonce (optionnel)", type: () => CommunityEntity })
  @ManyToOne(() => CommunityEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'community_id' })
  community?: CommunityEntity;

  /**
   * Liste des notes/avis associés à l'annonce
   */
  @ApiPropertyOptional({ description: "Liste des notes/avis associés à l'annonce", type: () => [RatingEntity] })
  @OneToMany(() => RatingEntity, rating => rating.announcement)
  ratings: RatingEntity[];
}
