import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Catégorie non trouvée');
    return category;
  }

  async update(id: number, data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    Object.assign(category, data);
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  async toggleActive(id: number): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    category.isActive = !category.isActive;
    return this.categoryRepository.save(category);
  }

  async findAllPaginated(page = 1, limit = 10): Promise<Pagination<CategoryEntity>> {
    const options: IPaginationOptions = { page, limit };
    const queryBuilder = this.categoryRepository.createQueryBuilder('category').orderBy('category.createdAt', 'DESC');
    return paginate<CategoryEntity>(queryBuilder, options);
  }
}
