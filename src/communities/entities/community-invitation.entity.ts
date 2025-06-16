import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn } from 'typeorm';
import { CommunityEntity } from './community.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CommunityInvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

@Entity('community_invitations')
export class CommunityInvitationEntity {
  @ApiProperty({ description: "Identifiant unique de l'invitation (UUID)", example: 'b1a2c3d4-e5f6-7890-1234-56789abcdef0' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: "Email de l'invité", example: 'invite@email.com' })
  @Column()
  email: string;

  @ApiProperty({ description: "Token unique d'invitation", example: 'abcdef1234567890' })
  @Column({ unique: true })
  token: string;

  @ApiProperty({ enum: CommunityInvitationStatus, description: "Statut de l'invitation", example: CommunityInvitationStatus.PENDING })
  @Column({
    type: 'enum',
    enum: CommunityInvitationStatus,
    default: CommunityInvitationStatus.PENDING,
  })
  status: CommunityInvitationStatus;

  @ApiProperty({ description: 'Communauté concernée', type: () => CommunityEntity })
  @ManyToOne(() => CommunityEntity, { eager: true })
  @JoinColumn({ name: 'community_id' })
  community: CommunityEntity;

  @ApiPropertyOptional({ description: 'Utilisateur ayant envoyé l’invitation', type: () => UserEntity })
  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'invited_by_id' })
  invitedBy: UserEntity;

  @ApiProperty({ description: 'Date de création', example: '2025-06-16T12:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date de dernière modification', example: '2025-06-16T12:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Date d’expiration de l’invitation', example: '2025-06-23T12:00:00.000Z' })
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @ApiPropertyOptional({ description: 'Date de suppression logique (soft delete)', example: null })
  @DeleteDateColumn()
  deletedAt?: Date;
}
