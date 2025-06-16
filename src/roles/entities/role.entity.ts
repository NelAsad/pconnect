// -----------------------------------------------------------------------------
// Entité Role
// Représente un rôle dans la base de données
// Possède des relations ManyToMany avec Permission et OneToMany avec User
// -----------------------------------------------------------------------------
import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('roles')
export class RoleEntity {
  /**
   * Identifiant unique du rôle (clé primaire)
   */
  @ApiProperty({ example: 1, description: 'Identifiant unique du rôle' })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nom unique du rôle
   */
  @ApiProperty({ example: 'admin', description: 'Nom unique du rôle' })
  @Column({ unique: true })
  name: string;

  /**
   * Description optionnelle du rôle
   */
  @ApiPropertyOptional({ example: 'Administrateur de la plateforme', description: 'Description optionnelle du rôle' })
  @Column({ nullable: true })
  description?: string;

  /**
   * Liste des permissions associées à ce rôle
   */
  @ApiProperty({ type: () => [PermissionEntity], description: 'Permissions associées à ce rôle', required: false })
  @ManyToMany(() => PermissionEntity, permission => permission.roles, { cascade: true })
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: PermissionEntity[];

  /**
   * Liste des utilisateurs associés à ce rôle
   */
  @ApiProperty({ type: () => [UserEntity], description: 'Utilisateurs associés à ce rôle', required: false })
  @OneToMany(() => UserEntity, user => user.role)
  users: UserEntity[];
}
