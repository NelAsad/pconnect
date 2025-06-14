// -----------------------------------------------------------------------------
// Contrôleur de gestion des permissions (endpoints CRUD)
// Expose les routes pour la gestion des permissions
// Utilise le service PermissionService pour la logique métier
// -----------------------------------------------------------------------------
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * Crée une nouvelle permission
   * @param dto Données de la permission à créer
   */
  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionService.create(dto);
  }

  /**
   * Liste toutes les permissions
   */
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  /**
   * Récupère une permission par son id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(Number(id));
  }

  /**
   * Met à jour une permission
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionService.update(Number(id), dto);
  }

  /**
   * Supprime une permission
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(Number(id));
  }
}
