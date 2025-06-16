import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingEntity } from './entities/rating.entity';

/**
 * Service métier pour la gestion des notes/évaluations (ratings).
 * Centralise la logique de création, consultation, modification et suppression des notes entre utilisateurs.
 * Utilise TypeORM pour l'accès à la base de données et la gestion des relations.
 */
@Injectable()
export class RatingService {
  /**
   * Injection du repository TypeORM pour l'entité Rating.
   */
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
  ) {}

  /**
   * Crée une nouvelle note/évaluation en base.
   * @param data Données de la note à créer
   */
  async create(data: Partial<RatingEntity>): Promise<RatingEntity> {
    const rating = this.ratingRepository.create(data);
    return this.ratingRepository.save(rating);
  }

  /**
   * Récupère toutes les notes (non paginées), avec relations principales.
   */
  async findAll(): Promise<RatingEntity[]> {
    return this.ratingRepository.find({
      relations: ['sender', 'receiver', 'announcement'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Récupère une note par son identifiant, avec relations.
   * @param id Identifiant de la note
   * @throws NotFoundException si la note n'existe pas
   */
  async findOne(id: number): Promise<RatingEntity> {
    const rating = await this.ratingRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'announcement'],
    });
    if (!rating) throw new NotFoundException('Note non trouvée');
    return rating;
  }

  /**
   * Met à jour une note existante.
   * @param id Identifiant de la note
   * @param data Données à mettre à jour
   */
  async update(id: number, data: Partial<RatingEntity>): Promise<RatingEntity> {
    const rating = await this.findOne(id);
    Object.assign(rating, data);
    return this.ratingRepository.save(rating);
  }

  /**
   * Supprime définitivement une note de la base.
   * @param id Identifiant de la note
   */
  async remove(id: number): Promise<void> {
    const rating = await this.findOne(id);
    await this.ratingRepository.remove(rating);
  }
}
