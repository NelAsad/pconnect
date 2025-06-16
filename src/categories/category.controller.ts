import { Body, Controller, Delete, Get, Param, Post, Put, Query, Patch } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    return this.categoryService.create(data);
  }

  @Get('paginated')
  async findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<Pagination<CategoryEntity>> {
    return this.categoryService.findAllPaginated(Number(page), Number(limit));
  }

  @Get()
  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<CategoryEntity> {
    return this.categoryService.findOne(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    return this.categoryService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.categoryService.remove(Number(id));
  }

  @Patch(':id/toggle')
  async toggleActive(@Param('id') id: number): Promise<CategoryEntity> {
    return this.categoryService.toggleActive(Number(id));
  }
  
}
