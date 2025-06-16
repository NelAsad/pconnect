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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Entité représentant une candidature d'un utilisateur pour rejoindre une communauté.
 */
@Entity('community_applications')
export class CommunityApplicationEntity {
  /**
   * Identifiant unique de la candidature (clé primaire)
   */
  @ApiProperty({ description: 'Identifiant unique de la candidature', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Utilisateur ayant soumis la candidature
   */
  @ApiProperty({ description: 'Utilisateur ayant soumis la candidature', type: () => UserEntity })
  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user: UserEntity;

  /**
   * Communauté visée par la candidature
   */
  @ApiProperty({ description: 'Communauté visée par la candidature', type: () => CommunityEntity })
  @ManyToOne(() => CommunityEntity, { eager: true, nullable: false })
  community: CommunityEntity;

  /**
   * Statut de la candidature (PENDING, ACCEPTED, REJECTED)
   */
  @ApiProperty({ description: 'Statut de la candidature', example: 'PENDING', enum: ['PENDING', 'ACCEPTED', 'REJECTED'] })
  @Column({ type: 'varchar', default: 'PENDING' })
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';

  /**
   * Date de création de la candidature
   */
  @ApiProperty({ description: 'Date de création de la candidature', example: '2025-06-16T12:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Date de dernière mise à jour de la candidature
   */
  @ApiProperty({ description: 'Date de dernière mise à jour de la candidature', example: '2025-06-16T12:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}