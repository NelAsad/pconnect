// -----------------------------------------------------------------------------
// Contrôleur de gestion des permissions (endpoints CRUD)
// Expose les routes pour la gestion des permissions
// Utilise le service PermissionService pour la logique métier
// -----------------------------------------------------------------------------
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionEntity } from './entities/permission.entity';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * Crée une nouvelle permission
   * @param dto Données de la permission à créer
   */
  @ApiOperation({ summary: 'Créer une nouvelle permission' })
  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({ status: 201, description: 'Permission créée', type: PermissionEntity })
  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionService.create(dto);
  }

  /**
   * Liste toutes les permissions
   */
  @ApiOperation({ summary: 'Lister toutes les permissions' })
  @ApiResponse({ status: 200, description: 'Liste des permissions', type: [PermissionEntity] })
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  /**
   * Récupère une permission par son id
   */
  @ApiOperation({ summary: 'Récupérer une permission par son id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Permission trouvée', type: PermissionEntity })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(Number(id));
  }

  /**
   * Met à jour une permission
   */
  @ApiOperation({ summary: 'Mettre à jour une permission' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePermissionDto })
  @ApiResponse({ status: 200, description: 'Permission mise à jour', type: PermissionEntity })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionService.update(Number(id), dto);
  }

  /**
   * Supprime une permission
   */
  @ApiOperation({ summary: 'Supprimer une permission' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Permission supprimée' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(Number(id));
  }
}
