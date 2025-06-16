import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnouncementEntity } from './entities/announcement.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(AnnouncementEntity)
    private readonly announcementRepository: Repository<AnnouncementEntity>,
  ) {}

  async create(data: Partial<AnnouncementEntity>): Promise<AnnouncementEntity> {
    const announcement = this.announcementRepository.create(data);
    return this.announcementRepository.save(announcement);
  }

  async findAll(): Promise<AnnouncementEntity[]> {
    return this.announcementRepository.find({
      relations: ['category', 'user', 'community'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllPaginated(page = 1, limit = 10): Promise<Pagination<AnnouncementEntity>> {
    const options: IPaginationOptions = { page, limit };
    const queryBuilder = this.announcementRepository.createQueryBuilder('announcement')
      .leftJoinAndSelect('announcement.category', 'category')
      .leftJoinAndSelect('announcement.user', 'user')
      .leftJoinAndSelect('announcement.community', 'community')
      .orderBy('announcement.createdAt', 'DESC');
    return paginate<AnnouncementEntity>(queryBuilder, options);
  }

  async findOne(id: number): Promise<AnnouncementEntity> {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
      relations: ['category', 'user', 'community'],
    });
    if (!announcement) throw new NotFoundException('Annonce non trouvée');
    return announcement;
  }

  async update(id: number, data: Partial<AnnouncementEntity>): Promise<AnnouncementEntity> {
    const announcement = await this.findOne(id);
    Object.assign(announcement, data);
    return this.announcementRepository.save(announcement);
  }

  async remove(id: number): Promise<void> {
    const announcement = await this.findOne(id);
    await this.announcementRepository.remove(announcement);
  }

  async togglePublish(id: number): Promise<AnnouncementEntity> {
    const announcement = await this.findOne(id);
    announcement.isPublished = !announcement.isPublished;
    return this.announcementRepository.save(announcement);
  }
}
