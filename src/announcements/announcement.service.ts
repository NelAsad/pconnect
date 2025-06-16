import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnouncementEntity } from './entities/announcement.entity';
import { SearchAnnouncementDto } from './dto/search-announcement.dto';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

/**
 * Service métier pour la gestion des annonces (announcements).
 * Centralise la logique d'accès aux données, de recherche, de pagination et de gestion métier.
 * Utilise TypeORM pour l'accès à la base de données.
 */
@Injectable()
export class AnnouncementService {
  /**
   * Injection du repository TypeORM pour l'entité Announcement.
   */
  constructor(
    @InjectRepository(AnnouncementEntity)
    private readonly announcementRepository: Repository<AnnouncementEntity>,
  ) {}

  /**
   * Crée une nouvelle annonce en base.
   * @param data Données de l'annonce à créer
   */
  async create(data: Partial<AnnouncementEntity>): Promise<AnnouncementEntity> {
    const announcement = this.announcementRepository.create(data);
    return this.announcementRepository.save(announcement);
  }

  /**
   * Récupère toutes les annonces (non paginées), avec relations principales.
   */
  async findAll(): Promise<AnnouncementEntity[]> {
    return this.announcementRepository.find({
      relations: ['category', 'user', 'community'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Récupère les annonces paginées (avec relations), triées par date de création.
   * @param page Page courante
   * @param limit Nombre d'éléments par page
   */
  async findAllPaginated(page = 1, limit = 10): Promise<Pagination<AnnouncementEntity>> {
    const options: IPaginationOptions = { page, limit };
    const queryBuilder = this.announcementRepository.createQueryBuilder('announcement')
      .leftJoinAndSelect('announcement.category', 'category')
      .leftJoinAndSelect('announcement.user', 'user')
      .leftJoinAndSelect('announcement.community', 'community')
      .orderBy('announcement.createdAt', 'DESC');
    return paginate<AnnouncementEntity>(queryBuilder, options);
  }

  /**
   * Récupère une annonce par son identifiant, avec relations.
   * @param id Identifiant de l'annonce
   * @throws NotFoundException si l'annonce n'existe pas
   */
  async findOne(id: number): Promise<AnnouncementEntity> {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
      relations: ['category', 'user', 'community'],
    });
    if (!announcement) throw new NotFoundException('Annonce non trouvée');
    return announcement;
  }

  /**
   * Met à jour une annonce existante.
   * @param id Identifiant de l'annonce
   * @param data Données à mettre à jour
   */
  async update(id: number, data: Partial<AnnouncementEntity>): Promise<AnnouncementEntity> {
    const announcement = await this.findOne(id);
    Object.assign(announcement, data);
    return this.announcementRepository.save(announcement);
  }

  /**
   * Supprime définitivement une annonce de la base.
   * @param id Identifiant de l'annonce
   */
  async remove(id: number): Promise<void> {
    const announcement = await this.findOne(id);
    await this.announcementRepository.remove(announcement);
  }

  /**
   * Active/désactive la publication d'une annonce (toggle isPublished).
   * @param id Identifiant de l'annonce
   */
  async togglePublish(id: number): Promise<AnnouncementEntity> {
    const announcement = await this.findOne(id);
    announcement.isPublished = !announcement.isPublished;
    return this.announcementRepository.save(announcement);
  }

  /**
   * Recherche avancée paginée sur les annonces.
   * Supporte les filtres multi-critères (mot-clé, type, catégorie, publication, utilisateur, communauté, dates).
   * @param dto Critères de recherche (voir SearchAnnouncementDto)
   */
  async search(dto: SearchAnnouncementDto): Promise<Pagination<AnnouncementEntity>> {
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const options: IPaginationOptions = { page, limit };
    const qb = this.announcementRepository.createQueryBuilder('announcement')
      .leftJoinAndSelect('announcement.category', 'category')
      .leftJoinAndSelect('announcement.user', 'user')
      .leftJoinAndSelect('announcement.community', 'community');

    if (dto.keyword) {
      qb.andWhere('(announcement.title LIKE :kw OR announcement.description LIKE :kw)', { kw: `%${dto.keyword}%` });
    }
    if (dto.type) {
      qb.andWhere('announcement.type = :type', { type: dto.type });
    }
    if (dto.categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId: dto.categoryId });
    }
    if (dto.isPublished !== undefined) {
      qb.andWhere('announcement.isPublished = :isPublished', { isPublished: dto.isPublished });
    }
    if (dto.userId) {
      qb.andWhere('user.id = :userId', { userId: dto.userId });
    }
    if (dto.communityId) {
      qb.andWhere('community.id = :communityId', { communityId: dto.communityId });
    }
    if (dto.createdAtMin) {
      qb.andWhere('announcement.createdAt >= :createdAtMin', { createdAtMin: dto.createdAtMin });
    }
    if (dto.createdAtMax) {
      qb.andWhere('announcement.createdAt <= :createdAtMax', { createdAtMax: dto.createdAtMax });
    }
    qb.orderBy('announcement.createdAt', 'DESC');
    return paginate<AnnouncementEntity>(qb, options);
  }
}
