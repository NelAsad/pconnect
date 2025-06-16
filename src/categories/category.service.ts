import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CategoryEntity } from './entities/category.entity';

/**
 * Service métier pour la gestion des catégories.
 * Centralise la logique de création, consultation, modification, activation/désactivation et suppression des catégories.
 * Utilise TypeORM pour l'accès à la base de données.
 */
@Injectable()
export class CategoryService {
  /**
   * Injection du repository TypeORM pour l'entité Category.
   */
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  /**
   * Crée une nouvelle catégorie en base.
   * @param data Données de la catégorie à créer
   */
  async create(data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  /**
   * Récupère toutes les catégories (non paginées), triées par date de création.
   */
  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({ order: { createdAt: 'DESC' } });
  }

  /**
   * Récupère une catégorie par son identifiant.
   * @param id Identifiant de la catégorie
   * @throws NotFoundException si la catégorie n'existe pas
   */
  async findOne(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Catégorie non trouvée');
    return category;
  }

  /**
   * Met à jour une catégorie existante.
   * @param id Identifiant de la catégorie
   * @param data Données à mettre à jour
   */
  async update(id: number, data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    Object.assign(category, data);
    return this.categoryRepository.save(category);
  }

  /**
   * Supprime définitivement une catégorie de la base.
   * @param id Identifiant de la catégorie
   */
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  /**
   * Active/désactive une catégorie (toggle isActive).
   * @param id Identifiant de la catégorie
   */
  async toggleActive(id: number): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    category.isActive = !category.isActive;
    return this.categoryRepository.save(category);
  }

  /**
   * Récupère les catégories paginées, triées par date de création.
   * @param page Page courante
   * @param limit Nombre d'éléments par page
   */
  async findAllPaginated(page = 1, limit = 10): Promise<Pagination<CategoryEntity>> {
    const options: IPaginationOptions = { page, limit };
    const queryBuilder = this.categoryRepository.createQueryBuilder('category').orderBy('category.createdAt', 'DESC');
    return paginate<CategoryEntity>(queryBuilder, options);
  }
}
