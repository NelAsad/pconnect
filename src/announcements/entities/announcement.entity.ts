import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CommunityEntity } from 'src/communities/entities/community.entity';
import { RatingEntity } from 'src/ratings/entities/rating.entity';

export enum AnnouncementType {
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
}

@Entity('announcements')
export class AnnouncementEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: AnnouncementType })
  type: AnnouncementType;

  @Column({ default: false })
  isPublished: boolean;

  @Column('simple-array', { nullable: true })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CategoryEntity, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CommunityEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'community_id' })
  community?: CommunityEntity;

  @OneToMany(() => RatingEntity, rating => rating.announcement)
  ratings: RatingEntity[];
}
