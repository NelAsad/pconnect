// -----------------------------------------------------------------------------
// Entité Permission
// Représente une permission dans la base de données
// Possède des relations ManyToMany avec Role et User
// -----------------------------------------------------------------------------
import { RoleEntity } from 'src/roles/entities/role.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('permissions')
export class PermissionEntity {
    /**
     * Identifiant unique de la permission (clé primaire)
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Nom unique de la permission
     */
    @Column({ unique: true })
    name: string;

    /**
     * Description optionnelle de la permission
     */
    @Column({ nullable: true })
    description?: string;

    /**
     * Liste des rôles associés à cette permission
     */
    @ManyToMany(() => RoleEntity, role => role.permissions)
    roles: RoleEntity[];

    /**
     * Liste des utilisateurs associés à cette permission
     */
    @ManyToMany(() => UserEntity, user => user.permissions)
    users: UserEntity[];
}
