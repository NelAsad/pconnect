// -----------------------------------------------------------------------------
// Entité Permission
// Représente une permission dans la base de données
// Possède des relations ManyToMany avec Role et User
// -----------------------------------------------------------------------------
import { RoleEntity } from 'src/roles/entities/role.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('permissions')
export class PermissionEntity {
    /**
     * Identifiant unique de la permission (clé primaire)
     */
    @ApiProperty({ example: 1, description: 'Identifiant unique de la permission' })
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Nom unique de la permission
     */
    @ApiProperty({ example: 'user.read', description: 'Nom unique de la permission' })
    @Column({ unique: true })
    name: string;

    /**
     * Description optionnelle de la permission
     */
    @ApiPropertyOptional({ example: 'Permet de lire les utilisateurs', description: 'Description optionnelle de la permission' })
    @Column({ nullable: true })
    description?: string;

    /**
     * Liste des rôles associés à cette permission
     */
    @ApiProperty({ type: () => [RoleEntity], description: 'Rôles associés à cette permission', required: false })
    @ManyToMany(() => RoleEntity, role => role.permissions)
    roles: RoleEntity[];

    /**
     * Liste des utilisateurs associés à cette permission
     */
    @ApiProperty({ type: () => [UserEntity], description: 'Utilisateurs associés à cette permission', required: false })
    @ManyToMany(() => UserEntity, user => user.permissions)
    users: UserEntity[];
}
