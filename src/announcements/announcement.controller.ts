import { Body, Controller, Delete, Get, Param, Post, Put, Query, Patch } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementEntity } from './entities/announcement.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post()
  async create(@Body() data: Partial<AnnouncementEntity>): Promise<AnnouncementEntity> {
    return this.announcementService.create(data);
  }

  @Get()
  async findAll(): Promise<AnnouncementEntity[]> {
    return this.announcementService.findAll();
  }

  @Get('paginated')
  async findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<Pagination<AnnouncementEntity>> {
    return this.announcementService.findAllPaginated(Number(page), Number(limit));
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AnnouncementEntity> {
    return this.announcementService.findOne(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<AnnouncementEntity>): Promise<AnnouncementEntity> {
    return this.announcementService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.announcementService.remove(Number(id));
  }

  @Patch(':id/toggle-publish')
  async togglePublish(@Param('id') id: number): Promise<AnnouncementEntity> {
    return this.announcementService.togglePublish(Number(id));
  }
}
