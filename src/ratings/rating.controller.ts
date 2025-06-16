import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingEntity } from './entities/rating.entity';

/**
 * Contrôleur REST pour la gestion des notes/évaluations (ratings).
 * Permet de créer, consulter, modifier et supprimer des notes entre utilisateurs.
 * Les routes sont sécurisées côté service (vérification des droits à ajouter selon besoin).
 */
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
  @Post()
  async create(@Body() data: Partial<RatingEntity>): Promise<RatingEntity> {
    return this.ratingService.create(data);
  }

  /**
   * Récupère toutes les notes (non paginées).
   */
  @Get()
  async findAll(): Promise<RatingEntity[]> {
    return this.ratingService.findAll();
  }

  /**
   * Récupère une note par son id.
   * @param id Identifiant de la note
   */
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<RatingEntity> {
    return this.ratingService.findOne(Number(id));
  }

  /**
   * Met à jour une note existante.
   * @param id Identifiant de la note
   * @param data Données à mettre à jour
   */
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<RatingEntity>): Promise<RatingEntity> {
    return this.ratingService.update(Number(id), data);
  }

  /**
   * Supprime une note (suppression définitive).
   * @param id Identifiant de la note
   */
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.ratingService.remove(Number(id));
  }
}
