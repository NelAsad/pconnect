import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { RatingService } from './rating.service';
import { RatingEntity } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

/**
 * Contrôleur REST pour la gestion des notes/évaluations (ratings).
 * Permet de créer, consulter, modifier et supprimer des notes entre utilisateurs.
 * Les routes sont sécurisées côté service (vérification des droits à ajouter selon besoin).
 */
@ApiTags('Ratings')
@Controller('ratings')
export class RatingController {
  /**
   * Injection du service métier des notes.
   */
  constructor(private readonly ratingService: RatingService) {}

  /**
   * Création d'une nouvelle note/évaluation.
   * @param data Données de la note à créer
   */
  @ApiOperation({ summary: 'Créer une nouvelle note/évaluation' })
  @ApiBody({ type: CreateRatingDto })
  @ApiResponse({ status: 201, description: 'Note créée', type: RatingEntity })
  @Post()
  async create(@Body() data: CreateRatingDto): Promise<RatingEntity> {
    return this.ratingService.create(data);
  }

  /**
   * Récupère toutes les notes (non paginées).
   */
  @ApiOperation({ summary: 'Lister toutes les notes/évaluations' })
  @ApiResponse({ status: 200, description: 'Liste des notes', type: [RatingEntity] })
  @Get()
  async findAll(): Promise<RatingEntity[]> {
    return this.ratingService.findAll();
  }

  /**
   * Récupère une note par son id.
   * @param id Identifiant de la note
   */
  @ApiOperation({ summary: 'Récupérer une note par son id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Note trouvée', type: RatingEntity })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<RatingEntity> {
    return this.ratingService.findOne(Number(id));
  }

  /**
   * Met à jour une note existante.
   * @param id Identifiant de la note
   * @param data Données à mettre à jour
   */
  @ApiOperation({ summary: 'Mettre à jour une note/évaluation' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateRatingDto })
  @ApiResponse({ status: 200, description: 'Note mise à jour', type: RatingEntity })
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: UpdateRatingDto): Promise<RatingEntity> {
    return this.ratingService.update(Number(id), data);
  }

  /**
   * Supprime une note (suppression définitive).
   * @param id Identifiant de la note
   */
  @ApiOperation({ summary: 'Supprimer une note/évaluation' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Note supprimée' })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.ratingService.remove(Number(id));
  }
}
