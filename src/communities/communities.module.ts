// -----------------------------------------------------------------------------
// Module Communities
// Centralise la gestion des communautés (groupes, forums, etc.)
// À compléter avec services, contrôleurs et entités selon les besoins métier
// -----------------------------------------------------------------------------
import { Module } from '@nestjs/common';
import { CommunitiesController } from './communities.controller';
import { CommunitiesService } from './communities.service';

@Module({
  imports: [],
  controllers: [CommunitiesController],
  providers: [CommunitiesService],
  exports: [CommunitiesService],
})
export class CommunitiesModule {}
