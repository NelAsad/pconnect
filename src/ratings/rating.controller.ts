import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingEntity } from './entities/rating.entity';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async create(@Body() data: Partial<RatingEntity>): Promise<RatingEntity> {
    return this.ratingService.create(data);
  }

  @Get()
  async findAll(): Promise<RatingEntity[]> {
    return this.ratingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<RatingEntity> {
    return this.ratingService.findOne(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<RatingEntity>): Promise<RatingEntity> {
    return this.ratingService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.ratingService.remove(Number(id));
  }
}
