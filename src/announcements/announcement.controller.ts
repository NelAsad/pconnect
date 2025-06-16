import { Body, Controller, Delete, Get, Param, Post, Put, Query, Patch } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementEntity } from './entities/announcement.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SearchAnnouncementDto } from './dto/search-announcement.dto';
// Swagger imports
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

/**
 * Contrôleur REST pour la gestion des annonces (announcements).
 * Fournit les endpoints CRUD, pagination, recherche avancée et publication.
 * Toutes les routes sont sécurisées côté service (vérification des droits à ajouter selon besoin).
 */
@ApiTags('Announcements')
@Controller('announcements')
export class AnnouncementController {
  /**
   * Injection du service métier des annonces.
   */
  constructor(private readonly announcementService: AnnouncementService) {}

  /**
   * Création d'une nouvelle annonce.
   * @param data Données de l'annonce à créer
   */
  @ApiOperation({ summary: 'Créer une nouvelle annonce' })
  @ApiBody({ type: AnnouncementEntity })
  @ApiResponse({ status: 201, description: 'Annonce créée', type: AnnouncementEntity })
  @Post()
  async create(@Body() data: Partial<AnnouncementEntity>): Promise<AnnouncementEntity> {
    return this.announcementService.create(data);
  }

  /**
   * Récupère toutes les annonces (non paginées).
   */
  @ApiOperation({ summary: 'Lister toutes les annonces (non paginées)' })
  @ApiResponse({ status: 200, description: 'Liste des annonces', type: [AnnouncementEntity] })
  @Get()
  async findAll(): Promise<AnnouncementEntity[]> {
    return this.announcementService.findAll();
  }

  /**
   * Récupère les annonces paginées (avec paramètres page/limit).
   */
  @ApiOperation({ summary: 'Lister les annonces paginées' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste paginée des annonces', type: Pagination })
  @Get('paginated')
  async findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<Pagination<AnnouncementEntity>> {
    return this.announcementService.findAllPaginated(Number(page), Number(limit));
  }

  /**
   * Récupère une annonce par son id.
   * @param id Identifiant de l'annonce
   */
  @ApiOperation({ summary: 'Récupérer une annonce par id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Annonce trouvée', type: AnnouncementEntity })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AnnouncementEntity> {
    return this.announcementService.findOne(Number(id));
  }

  /**
   * Met à jour une annonce existante.
   * @param id Identifiant de l'annonce
   * @param data Données à mettre à jour
   */
  @ApiOperation({ summary: 'Mettre à jour une annonce' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: AnnouncementEntity })
  @ApiResponse({ status: 200, description: 'Annonce mise à jour', type: AnnouncementEntity })
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<AnnouncementEntity>): Promise<AnnouncementEntity> {
    return this.announcementService.update(Number(id), data);
  }

  /**
   * Supprime une annonce (suppression définitive, pas soft delete).
   * @param id Identifiant de l'annonce
   */
  @ApiOperation({ summary: 'Supprimer une annonce' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Annonce supprimée' })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.announcementService.remove(Number(id));
  }

  /**
   * Active/désactive la publication d'une annonce (toggle isPublished).
   * @param id Identifiant de l'annonce
   */
  @ApiOperation({ summary: 'Activer/désactiver la publication d\'une annonce' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Annonce mise à jour (publication togglée)', type: AnnouncementEntity })
  @Patch(':id/toggle-publish')
  async togglePublish(@Param('id') id: number): Promise<AnnouncementEntity> {
    return this.announcementService.togglePublish(Number(id));
  }

  /**
   * Recherche avancée paginée sur les annonces (multi-critères).
   * @param query Critères de recherche (voir DTO)
   */
  @ApiOperation({ summary: 'Recherche avancée paginée sur les annonces' })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'isPublished', required: false, type: Boolean })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'communityId', required: false, type: Number })
  @ApiQuery({ name: 'createdAtMin', required: false, type: String })
  @ApiQuery({ name: 'createdAtMax', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Résultats de la recherche paginée', type: Pagination })
  @Get('search')
  async search(@Query() query: SearchAnnouncementDto): Promise<Pagination<AnnouncementEntity>> {
    return this.announcementService.search(query);
  }
}
