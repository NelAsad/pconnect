import { Body, Controller, Delete, Get, Param, Post, Put, Query, Patch } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementEntity } from './entities/announcement.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SearchAnnouncementDto } from './dto/search-announcement.dto';

/**
 * Contrôleur REST pour la gestion des annonces (announcements).
 * Fournit les endpoints CRUD, pagination, recherche avancée et publication.
 * Toutes les routes sont sécurisées côté service (vérification des droits à ajouter selon besoin).
 */
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
  @Post()
  async create(@Body() data: Partial<AnnouncementEntity>): Promise<AnnouncementEntity> {
    return this.announcementService.create(data);
  }

  /**
   * Récupère toutes les annonces (non paginées).
   */
  @Get()
  async findAll(): Promise<AnnouncementEntity[]> {
    return this.announcementService.findAll();
  }

  /**
   * Récupère les annonces paginées (avec paramètres page/limit).
   */
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
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AnnouncementEntity> {
    return this.announcementService.findOne(Number(id));
  }

  /**
   * Met à jour une annonce existante.
   * @param id Identifiant de l'annonce
   * @param data Données à mettre à jour
   */
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<AnnouncementEntity>): Promise<AnnouncementEntity> {
    return this.announcementService.update(Number(id), data);
  }

  /**
   * Supprime une annonce (suppression définitive, pas soft delete).
   * @param id Identifiant de l'annonce
   */
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.announcementService.remove(Number(id));
  }

  /**
   * Active/désactive la publication d'une annonce (toggle isPublished).
   * @param id Identifiant de l'annonce
   */
  @Patch(':id/toggle-publish')
  async togglePublish(@Param('id') id: number): Promise<AnnouncementEntity> {
    return this.announcementService.togglePublish(Number(id));
  }

  /**
   * Recherche avancée paginée sur les annonces (multi-critères).
   * @param query Critères de recherche (voir DTO)
   */
  @Get('search')
  async search(@Query() query: SearchAnnouncementDto): Promise<Pagination<AnnouncementEntity>> {
    return this.announcementService.search(query);
  }
}
