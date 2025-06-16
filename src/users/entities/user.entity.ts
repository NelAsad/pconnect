import { CityEntity } from 'src/geography/entities/city.entity';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { CommunityEntity } from 'src/communities/entities/community.entity';
import { AnnouncementEntity } from 'src/announcements/entities/announcement.entity';
import { RatingEntity } from 'src/ratings/entities/rating.entity';
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable,
    JoinColumn, OneToMany
} from 'typeorm';

// -----------------------------------------------------------------------------
// Entité User
// Représente un utilisateur dans la base de données.
// Possède des relations avec City, Role, Permission, OTP, etc.
// -----------------------------------------------------------------------------

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ name: 'hashed_refresh_token', nullable: true })
    hashedRefreshToken: string;

    // Relations géographiques
    @ManyToOne(() => CityEntity, { nullable: true })
    city: CityEntity;

    // Rôle unique
    @ManyToOne(() => RoleEntity, role => role.users, { eager: true })
    @JoinColumn({ name: 'role_id' })
    role: RoleEntity;

    // Permissions individuelles
    @ManyToMany(() => PermissionEntity, permission => permission.users)
    @JoinTable({
        name: 'users_permissions',
        joinColumn: { name: 'user_id' },
        inverseJoinColumn: { name: 'permission_id' }
    })
    permissions: PermissionEntity[];

    /**
     * Liste des communautés dont l'utilisateur est membre
     */
    @ManyToMany(() => CommunityEntity, community => community.members)
    communities: CommunityEntity[];

    @Column({ default: false })
    isActive: boolean;

    @Column({ default: true })
    isVisible: boolean;

    @Column({ nullable: true })
    profilePicture?: string;

    @OneToMany(() => AnnouncementEntity, announcement => announcement.user)
    announcements: AnnouncementEntity[];

    @OneToMany(() => RatingEntity, rating => rating.sender)
    ratingsSent: RatingEntity[];

    @OneToMany(() => RatingEntity, rating => rating.receiver)
    ratingsReceived: RatingEntity[];
}
