import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn } from 'typeorm';
import { CommunityEntity } from './community.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export enum CommunityInvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

@Entity('community_invitations')
export class CommunityInvitationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ unique: true })
  token: string;

  @Column({
    type: 'enum',
    enum: CommunityInvitationStatus,
    default: CommunityInvitationStatus.PENDING,
  })
  status: CommunityInvitationStatus;

  @ManyToOne(() => CommunityEntity, { eager: true })
  @JoinColumn({ name: 'community_id' })
  community: CommunityEntity;

  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'invited_by_id' })
  invitedBy: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
