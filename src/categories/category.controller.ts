import { Body, Controller, Delete, Get, Param, Post, Put, Query, Patch } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

/**
 * Contrôleur REST pour la gestion des catégories.
 * Permet de créer, consulter, modifier, activer/désactiver et supprimer des catégories.
 * Les routes sont sécurisées côté service (vérification des droits à ajouter selon besoin).
 */
@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  /**
   * Injection du service métier des catégories.
   */
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Création d'une nouvelle catégorie.
   * @param data Données de la catégorie à créer
   */
  @ApiOperation({ summary: 'Créer une nouvelle catégorie' })
  @ApiBody({ type: CategoryEntity })
  @ApiResponse({ status: 201, description: 'Catégorie créée', type: CategoryEntity })
  @Post()
  async create(@Body() data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    return this.categoryService.create(data);
  }

  /**
   * Récupère les catégories paginées (avec paramètres page/limit).
   */
  @ApiOperation({ summary: 'Lister les catégories paginées' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste paginée des catégories', type: Pagination })
  @Get('paginated')
  async findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<Pagination<CategoryEntity>> {
    return this.categoryService.findAllPaginated(Number(page), Number(limit));
  }

  /**
   * Récupère toutes les catégories (non paginées).
   */
  @ApiOperation({ summary: 'Lister toutes les catégories (non paginées)' })
  @ApiResponse({ status: 200, description: 'Liste des catégories', type: [CategoryEntity] })
  @Get()
  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryService.findAll();
  }

  /**
   * Récupère une catégorie par son id.
   * @param id Identifiant de la catégorie
   */
  @ApiOperation({ summary: 'Récupérer une catégorie par id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Catégorie trouvée', type: CategoryEntity })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<CategoryEntity> {
    return this.categoryService.findOne(Number(id));
  }

  /**
   * Met à jour une catégorie existante.
   * @param id Identifiant de la catégorie
   * @param data Données à mettre à jour
   */
  @ApiOperation({ summary: 'Mettre à jour une catégorie' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CategoryEntity })
  @ApiResponse({ status: 200, description: 'Catégorie mise à jour', type: CategoryEntity })
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    return this.categoryService.update(Number(id), data);
  }

  /**
   * Supprime une catégorie (suppression définitive).
   * @param id Identifiant de la catégorie
   */
  @ApiOperation({ summary: 'Supprimer une catégorie' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Catégorie supprimée' })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.categoryService.remove(Number(id));
  }

  /**
   * Active/désactive une catégorie (toggle isActive).
   * @param id Identifiant de la catégorie
   */
  @ApiOperation({ summary: 'Activer/désactiver une catégorie' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Catégorie mise à jour (statut togglé)', type: CategoryEntity })
  @Patch(':id/toggle')
  async toggleActive(@Param('id') id: number): Promise<CategoryEntity> {
    return this.categoryService.toggleActive(Number(id));
  }
}
