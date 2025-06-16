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

@Entity('communities')
export class CommunityEntity {
  /**
   * Identifiant unique de la communauté (clé primaire)
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nom de la communauté
   */
  @Column()
  name: string;

  /**
   * Slug (optionnel, pour les URLs)
   */
  @Column({ nullable: true, unique: true })
  slug?: string;

  /**
   * Description de la communauté
   */
  @Column('text')
  description: string;

  /**
   * Statut de la communauté (enum)
   */
  @Column({ type: 'enum', enum: CommunityStatus, default: CommunityStatus.PENDING })
  status: CommunityStatus;

  /**
   * Logo (URL ou chemin local, optionnel)
   */
  @Column({ nullable: true })
  logo?: string;

  /**
   * Date de création
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Date de dernière mise à jour
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Date de suppression logique (soft delete)
   */
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  /**
   * Utilisateur créateur de la communauté
   */
  @ManyToOne(() => UserEntity, { eager: true })
  createdBy: UserEntity;

  /**
   * Membres de la communauté (ManyToMany avec UserEntity)
   */
  @ManyToMany(() => UserEntity, { eager: false })
  @JoinTable({ name: 'communities_members' })
  members: UserEntity[];

  /**
   * Ville associée (optionnelle)
   */
  @ManyToOne(() => CityEntity, { nullable: true, eager: false })
  city?: CityEntity;

  /**
   * Pays associé (optionnel)
   */
  @ManyToOne(() => CountryEntity, { nullable: true, eager: false })
  country?: CountryEntity;

  /**
   * Annonces liées à la communauté (OneToMany avec AnnouncementEntity)
   */
  @OneToMany(() => AnnouncementEntity, announcement => announcement.community)
  announcements: AnnouncementEntity[];
}