// -----------------------------------------------------------------------------
// Service de gestion des rôles
// Fournit les opérations CRUD et la gestion des permissions associées aux rôles
// Centralise la logique métier liée aux rôles
// -----------------------------------------------------------------------------
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  /**
   * Crée un nouveau rôle avec permissions optionnelles
   * @param dto Données du rôle à créer
   * @returns Le rôle créé
   */
  async create(dto: CreateRoleDto): Promise<RoleEntity> {
    const permissions = dto.permissionIds
      ? await this.permissionRepository.findByIds(dto.permissionIds)
      : [];
    const role = this.roleRepository.create({
      name: dto.name,
      description: dto.description,
      permissions,
    });
    return this.roleRepository.save(role);
  }

  /**
   * Retourne la liste de tous les rôles avec leurs permissions
   */
  async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.find({ relations: ['permissions'] });
  }

  /**
   * Retourne un rôle par son id avec ses permissions
   * @param id Identifiant du rôle
   * @throws NotFoundException si le rôle n'existe pas
   */
  async findOne(id: number): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });
    if (!role) throw new NotFoundException('Role non trouvé');
    return role;
  }

  /**
   * Met à jour un rôle
   * @param id Identifiant du rôle
   * @param dto Données à mettre à jour
   * @returns Le rôle mis à jour
   */
  async update(id: number, dto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.findOne(id);
    if (dto.name) role.name = dto.name;
    if (dto.description) role.description = dto.description;
    if (dto.permissionIds) {
      role.permissions = await this.permissionRepository.findByIds(dto.permissionIds);
    }
    return this.roleRepository.save(role);
  }

  /**
   * Supprime un rôle
   * @param id Identifiant du rôle
   */
  async remove(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }

  /**
   * Ajoute des permissions à un rôle
   * @param roleId Identifiant du rôle
   * @param permissionIds Identifiants des permissions à ajouter
   * @returns Le rôle mis à jour
   */
  async addPermissionsToRole(roleId: number, permissionIds: number[]): Promise<RoleEntity> {
    const role = await this.findOne(roleId);
    const permissionsToAdd = await this.permissionRepository.findByIds(permissionIds);
    // Ajoute les permissions sans doublons
    const permissionMap = new Map(role.permissions.map(p => [p.id, p]));
    for (const perm of permissionsToAdd) {
      permissionMap.set(perm.id, perm);
    }
    role.permissions = Array.from(permissionMap.values());
    return this.roleRepository.save(role);
  }

  /**
   * Retire des permissions d'un rôle
   * @param roleId Identifiant du rôle
   * @param permissionIds Identifiants des permissions à retirer
   * @returns Le rôle mis à jour
   */
  async removePermissionsFromRole(roleId: number, permissionIds: number[]): Promise<RoleEntity> {
    const role = await this.findOne(roleId);
    role.permissions = role.permissions.filter(p => !permissionIds.includes(p.id));
    return this.roleRepository.save(role);
  }
}
