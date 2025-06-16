// -----------------------------------------------------------------------------
// Entité Community
// Représente une communauté (groupe, forum, etc.) dans la base de données
// -----------------------------------------------------------------------------
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CityEntity } from 'src/geography/entities/city.entity';
import { CountryEntity } from 'src/geography/entities/country.entity';
import { CommunityStatus } from 'src/common/enums/community-status.enum';
import { AnnouncementEntity } from 'src/announcements/entities/announcement.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('communities')
export class CommunityEntity {
  /**
   * Identifiant unique de la communauté (clé primaire)
   */
  @ApiProperty({ description: 'Identifiant unique de la communauté', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nom de la communauté
   */
  @ApiProperty({ description: 'Nom de la communauté', example: 'Développeurs Paris' })
  @Column()
  name: string;

  /**
   * Slug (optionnel, pour les URLs)
   */
  @ApiPropertyOptional({ description: 'Slug de la communauté', example: 'developpeurs-paris' })
  @Column({ nullable: true, unique: true })
  slug?: string;

  /**
   * Description de la communauté
   */
  @ApiProperty({ description: 'Description de la communauté', example: 'Communauté de développeurs basée à Paris.' })
  @Column('text')
  description: string;

  /**
   * Statut de la communauté (enum)
   */
  @ApiProperty({ enum: CommunityStatus, description: 'Statut de la communauté', example: CommunityStatus.PENDING })
  @Column({ type: 'enum', enum: CommunityStatus, default: CommunityStatus.PENDING })
  status: CommunityStatus;

  /**
   * Logo (URL ou chemin local, optionnel)
   */
  @ApiPropertyOptional({ description: 'Logo de la communauté', example: '/uploads/logo.png' })
  @Column({ nullable: true })
  logo?: string;

  /**
   * Date de création
   */
  @ApiProperty({ description: 'Date de création', example: '2025-06-16T12:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Date de dernière mise à jour
   */
  @ApiProperty({ description: 'Date de dernière mise à jour', example: '2025-06-16T12:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Date de suppression logique (soft delete)
   */
  @ApiPropertyOptional({ description: 'Date de suppression logique (soft delete)', example: null })
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  /**
   * Utilisateur créateur de la communauté
   */
  @ApiProperty({ description: 'Utilisateur créateur de la communauté', type: () => UserEntity })
  @ManyToOne(() => UserEntity, { eager: true })
  createdBy: UserEntity;

  /**
   * Membres de la communauté (ManyToMany avec UserEntity)
   */
  @ApiPropertyOptional({ description: 'Membres de la communauté', type: () => [UserEntity] })
  @ManyToMany(() => UserEntity, { eager: false })
  @JoinTable({ name: 'communities_members' })
  members: UserEntity[];

  /**
   * Ville associée (optionnelle)
   */
  @ApiPropertyOptional({ description: 'Ville associée', type: () => CityEntity })
  @ManyToOne(() => CityEntity, { nullable: true, eager: false })
  city?: CityEntity;

  /**
   * Pays associé (optionnel)
   */
  @ApiPropertyOptional({ description: 'Pays associé', type: () => CountryEntity })
  @ManyToOne(() => CountryEntity, { nullable: true, eager: false })
  country?: CountryEntity;

  /**
   * Annonces liées à la communauté (OneToMany avec AnnouncementEntity)
   */
  @ApiPropertyOptional({ description: 'Annonces liées à la communauté', type: () => [AnnouncementEntity] })
  @OneToMany(() => AnnouncementEntity, announcement => announcement.community)
  announcements: AnnouncementEntity[];
}