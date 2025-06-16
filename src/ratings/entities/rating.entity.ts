import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { AnnouncementEntity } from 'src/announcements/entities/announcement.entity';

@Entity('ratings')
export class RatingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', width: 1 })
  note: number; // de 1 à 5

  @Column('text', { nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  @ManyToOne(() => AnnouncementEntity, { eager: true })
  @JoinColumn({ name: 'announcement_id' })
  announcement: AnnouncementEntity;
}
