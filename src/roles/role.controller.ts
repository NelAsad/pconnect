// -----------------------------------------------------------------------------
// Contrôleur de gestion des rôles (endpoints CRUD et gestion des permissions)
// Expose les routes pour la gestion des rôles et l'attribution/retrait de permissions
// Utilise le service RoleService pour la logique métier
// -----------------------------------------------------------------------------
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolePermissionsDto } from './dto/role-permissions.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Crée un nouveau rôle
   * @param dto Données du rôle à créer
   */
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  /**
   * Liste tous les rôles
   */
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  /**
   * Récupère un rôle par son id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(Number(id));
  }

  /**
   * Met à jour un rôle
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(Number(id), dto);
  }

  /**
   * Supprime un rôle
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(Number(id));
  }

  /**
   * Ajoute des permissions à un rôle
   */
  @Post(':id/permissions')
  addPermissions(
    @Param('id') id: string,
    @Body() dto: RolePermissionsDto,
  ) {
    return this.roleService.addPermissionsToRole(Number(id), dto.permissionIds);
  }

  /**
   * Retire des permissions d'un rôle
   */
  @Delete(':id/permissions')
  removePermissions(
    @Param('id') id: string,
    @Body() dto: RolePermissionsDto,
  ) {
    return this.roleService.removePermissionsFromRole(Number(id), dto.permissionIds);
  }
}
