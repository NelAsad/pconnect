// -----------------------------------------------------------------------------
// Service de gestion des permissions
// Fournit les opérations CRUD pour l'entité Permission
// Centralise la logique métier liée aux permissions
// -----------------------------------------------------------------------------
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  /**
   * Crée une nouvelle permission
   * @param dto Données de la permission à créer
   * @returns La permission créée
   */
  async create(dto: CreatePermissionDto): Promise<PermissionEntity> {
    const permission = this.permissionRepository.create(dto);
    return this.permissionRepository.save(permission);
  }

  /**
   * Retourne la liste de toutes les permissions
   */
  async findAll(): Promise<PermissionEntity[]> {
    return this.permissionRepository.find();
  }

  /**
   * Retourne une permission par son id
   * @param id Identifiant de la permission
   * @throws NotFoundException si la permission n'existe pas
   */
  async findOne(id: number): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findOne({ where: { id } });
    if (!permission) throw new NotFoundException('Permission non trouvée');
    return permission;
  }

  /**
   * Met à jour une permission
   * @param id Identifiant de la permission
   * @param dto Données à mettre à jour
   * @returns La permission mise à jour
   */
  async update(id: number, dto: UpdatePermissionDto): Promise<PermissionEntity> {
    const permission = await this.findOne(id);
    if (dto.name) permission.name = dto.name;
    if (dto.description) permission.description = dto.description;
    return this.permissionRepository.save(permission);
  }

  /**
   * Supprime une permission
   * @param id Identifiant de la permission
   */
  async remove(id: number): Promise<void> {
    await this.permissionRepository.delete(id);
  }
}
