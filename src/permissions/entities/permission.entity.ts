import { RoleEntity } from 'src/roles/entities/role.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('permissions')
export class PermissionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToMany(() => RoleEntity, role => role.permissions)
    roles: RoleEntity[];

    @ManyToMany(() => UserEntity, user => user.permissions)
    users: UserEntity[];
}
