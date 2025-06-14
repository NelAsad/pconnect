import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CommunityEntity } from './community.entity';

/**
 * Entité représentant une candidature d'un utilisateur pour rejoindre une communauté.
 */
@Entity('community_applications')
export class CommunityApplicationEntity {
  /**
   * Identifiant unique de la candidature (clé primaire)
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Utilisateur ayant soumis la candidature
   */
  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user: UserEntity;

  /**
   * Communauté visée par la candidature
   */
  @ManyToOne(() => CommunityEntity, { eager: true, nullable: false })
  community: CommunityEntity;

  /**
   * Statut de la candidature (PENDING, ACCEPTED, REJECTED)
   */
  @Column({ type: 'varchar', default: 'PENDING' })
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';

  /**
   * Date de création de la candidature
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Date de dernière mise à jour de la candidature
   */
  @UpdateDateColumn()
  updatedAt: Date;
}