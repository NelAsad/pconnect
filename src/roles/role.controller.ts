// -----------------------------------------------------------------------------
// Contrôleur de gestion des rôles (endpoints CRUD et gestion des permissions)
// Expose les routes pour la gestion des rôles et l'attribution/retrait de permissions
// Utilise le service RoleService pour la logique métier
// -----------------------------------------------------------------------------
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolePermissionsDto } from './dto/role-permissions.dto';
import { RoleEntity } from './entities/role.entity';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Crée un nouveau rôle
   * @param dto Données du rôle à créer
   */
  @ApiOperation({ summary: 'Créer un nouveau rôle' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Rôle créé', type: RoleEntity })
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  /**
   * Liste tous les rôles
   */
  @ApiOperation({ summary: 'Lister tous les rôles' })
  @ApiResponse({ status: 200, description: 'Liste des rôles', type: [RoleEntity] })
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  /**
   * Récupère un rôle par son id
   */
  @ApiOperation({ summary: 'Récupérer un rôle par son id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Rôle trouvé', type: RoleEntity })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(Number(id));
  }

  /**
   * Met à jour un rôle
   */
  @ApiOperation({ summary: 'Mettre à jour un rôle' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Rôle mis à jour', type: RoleEntity })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(Number(id), dto);
  }

  /**
   * Supprime un rôle
   */
  @ApiOperation({ summary: 'Supprimer un rôle' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Rôle supprimé' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(Number(id));
  }

  /**
   * Ajoute des permissions à un rôle
   */
  @ApiOperation({ summary: 'Associer des permissions à un rôle' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: RolePermissionsDto })
  @ApiResponse({ status: 200, description: 'Permissions associées au rôle', type: RoleEntity })
  @Post(':id/permissions')
  addPermissions(@Param('id') id: string, @Body() dto: RolePermissionsDto) {
    return this.roleService.addPermissionsToRole(Number(id), dto.permissionIds);
  }

  /**
   * Retire des permissions d'un rôle
   */
  @ApiOperation({ summary: 'Retirer des permissions d’un rôle' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: RolePermissionsDto })
  @ApiResponse({ status: 200, description: 'Permissions retirées du rôle', type: RoleEntity })
  @Delete(':id/permissions')
  removePermissions(@Param('id') id: string, @Body() dto: RolePermissionsDto) {
    return this.roleService.removePermissionsFromRole(Number(id), dto.permissionIds);
  }
}
