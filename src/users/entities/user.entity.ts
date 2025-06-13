import { CityEntity } from 'src/geography/entities/city.entity';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { RoleEntity } from 'src/roles/entities/role.entity';
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable,
    JoinColumn
} from 'typeorm';


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

    @Column({ default: false })
    isActive: boolean;
}
