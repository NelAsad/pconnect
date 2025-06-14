// -----------------------------------------------------------------------------
// Module de gestion géographique (pays, villes)
// Déclare les entités, services et contrôleurs liés à la géographie
// À importer dans AppModule pour exposer les fonctionnalités géographiques
// -----------------------------------------------------------------------------
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './entities/city.entity';
import { CountryEntity } from './entities/country.entity';
import { GeographyService } from './geography.service';
import { GeographyController } from './geography.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity, CountryEntity])],
  providers: [GeographyService],
  controllers: [GeographyController],
  exports: [GeographyService],
})
export class GeographyModule {}
