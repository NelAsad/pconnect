import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingEntity } from './entities/rating.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
  ) {}

  async create(data: Partial<RatingEntity>): Promise<RatingEntity> {
    const rating = this.ratingRepository.create(data);
    return this.ratingRepository.save(rating);
  }

  async findAll(): Promise<RatingEntity[]> {
    return this.ratingRepository.find({
      relations: ['sender', 'receiver', 'announcement'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<RatingEntity> {
    const rating = await this.ratingRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'announcement'],
    });
    if (!rating) throw new NotFoundException('Note non trouvée');
    return rating;
  }

  async update(id: number, data: Partial<RatingEntity>): Promise<RatingEntity> {
    const rating = await this.findOne(id);
    Object.assign(rating, data);
    return this.ratingRepository.save(rating);
  }

  async remove(id: number): Promise<void> {
    const rating = await this.findOne(id);
    await this.ratingRepository.remove(rating);
  }
}
