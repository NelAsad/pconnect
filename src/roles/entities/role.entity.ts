import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';


@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => PermissionEntity, permission => permission.roles, { cascade: true })
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: PermissionEntity[];

  @OneToMany(() => UserEntity, user => user.role)
  users: UserEntity[];
}
