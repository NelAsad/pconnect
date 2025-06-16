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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Entité User
// Représente un utilisateur dans la base de données.
// Possède des relations avec City, Role, Permission, OTP, etc.
// -----------------------------------------------------------------------------

@Entity('users')
export class UserEntity {
    @ApiProperty({ example: 1, description: "Identifiant unique de l'utilisateur" })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'Jean Dupont', description: "Nom complet de l'utilisateur" })
    @Column()
    fullName: string;

    @ApiProperty({ example: 'jean.dupont@email.com', description: "Adresse e-mail de l'utilisateur" })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ example: '********', description: 'Mot de passe hashé de l’utilisateur', writeOnly: true })
    @Column()
    password: string;

    @ApiPropertyOptional({ example: 'Développeur passionné', description: 'Description ou biographie de l’utilisateur' })
    @Column({ nullable: true })
    description?: string;

    @ApiPropertyOptional({ example: 'refresh_token_hash', description: 'Hash du refresh token', writeOnly: true })
    @Column({ name: 'hashed_refresh_token', nullable: true })
    hashedRefreshToken: string;

    @ApiPropertyOptional({ type: () => CityEntity, description: 'Ville associée à l’utilisateur', required: false })
    @ManyToOne(() => CityEntity, { nullable: true })
    city: CityEntity;

    @ApiProperty({ type: () => RoleEntity, description: 'Rôle de l’utilisateur', required: true })
    @ManyToOne(() => RoleEntity, role => role.users, { eager: true })
    @JoinColumn({ name: 'role_id' })
    role: RoleEntity;

    @ApiProperty({ type: () => [PermissionEntity], description: 'Permissions individuelles de l’utilisateur', required: false })
    @ManyToMany(() => PermissionEntity, permission => permission.users)
    @JoinTable({
        name: 'users_permissions',
        joinColumn: { name: 'user_id' },
        inverseJoinColumn: { name: 'permission_id' }
    })
    permissions: PermissionEntity[];

    @ApiProperty({ type: () => [CommunityEntity], description: 'Communautés dont l’utilisateur est membre', required: false })
    @ManyToMany(() => CommunityEntity, community => community.members)
    communities: CommunityEntity[];

    @ApiProperty({ default: false, description: 'Indique si l’utilisateur est actif' })
    @Column({ default: false })
    isActive: boolean;

    @ApiProperty({ default: true, description: 'Indique si l’utilisateur est visible' })
    @Column({ default: true })
    isVisible: boolean;

    @ApiPropertyOptional({ example: 'https://cdn.site.com/photo.jpg', description: 'URL de la photo de profil', required: false })
    @Column({ nullable: true })
    profilePicture?: string;

    @ApiProperty({ type: () => [AnnouncementEntity], description: 'Annonces publiées par l’utilisateur', required: false })
    @OneToMany(() => AnnouncementEntity, announcement => announcement.user)
    announcements: AnnouncementEntity[];

    @ApiProperty({ type: () => [RatingEntity], description: 'Notes envoyées par l’utilisateur', required: false })
    @OneToMany(() => RatingEntity, rating => rating.sender)
    ratingsSent: RatingEntity[];

    @ApiProperty({ type: () => [RatingEntity], description: 'Notes reçues par l’utilisateur', required: false })
    @OneToMany(() => RatingEntity, rating => rating.receiver)
    ratingsReceived: RatingEntity[];

    @ApiPropertyOptional({ example: 'token_fcm', description: 'Token FCM pour notifications push', required: false })
    @Column({ nullable: true })
    fcmToken?: string;
}
