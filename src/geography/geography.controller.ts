// -----------------------------------------------------------------------------
// Contrôleur de gestion géographique (endpoints pays/villes)
// Expose les routes pour la gestion CRUD des pays et des villes
// Utilise le service GeographyService pour la logique métier
// -----------------------------------------------------------------------------
import { Controller, Body, Param, Get, Post, Patch, Delete } from '@nestjs/common';
import { GeographyService } from './geography.service';

@Controller('geography')
export class GeographyController {
  constructor(private readonly geographyService: GeographyService) {}

  // --- Country ---
  /**
   * Crée un pays
   * @param data Données du pays à créer
   */
  @Post('countries')
  createCountry(@Body() data) {
    return this.geographyService.createCountry(data);
  }

  /**
   * Liste tous les pays
   */
  @Get('countries')
  findAllCountries() {
    return this.geographyService.findAllCountries();
  }

  /**
   * Récupère un pays par son id
   */
  @Get('countries/:id')
  findCountryById(@Param('id') id: string) {
    return this.geographyService.findCountryById(Number(id));
  }

  /**
   * Met à jour un pays
   */
  @Patch('countries/:id')
  updateCountry(@Param('id') id: string, @Body() data) {
    return this.geographyService.updateCountry(Number(id), data);
  }

  /**
   * Supprime un pays
   */
  @Delete('countries/:id')
  removeCountry(@Param('id') id: string) {
    return this.geographyService.removeCountry(Number(id));
  }

  // --- City ---
  /**
   * Crée une ville
   * @param data Données de la ville à créer
   */
  @Post('cities')
  createCity(@Body() data) {
    return this.geographyService.createCity(data);
  }

  /**
   * Liste toutes les villes
   */
  @Get('cities')
  findAllCities() {
    return this.geographyService.findAllCities();
  }

  /**
   * Récupère une ville par son id
   */
  @Get('cities/:id')
  findCityById(@Param('id') id: string) {
    return this.geographyService.findCityById(Number(id));
  }

  /**
   * Met à jour une ville
   */
  @Patch('cities/:id')
  updateCity(@Param('id') id: string, @Body() data) {
    return this.geographyService.updateCity(Number(id), data);
  }

  /**
   * Supprime une ville
   */
  @Delete('cities/:id')
  removeCity(@Param('id') id: string) {
    return this.geographyService.removeCity(Number(id));
  }

  // --- Country-City Relationships ---
  /**
   * Ajoute plusieurs villes à un pays
   */
  @Post('countries/:id/cities')
  addCitiesToCountry(@Param('id') id: string, @Body('cityIds') cityIds: number[]) {
    return this.geographyService.addCitiesToCountry(Number(id), cityIds);
  }

  /**
   * Retire plusieurs villes d'un pays
   */
  @Delete('countries/:id/cities')
  removeCitiesFromCountry(@Param('id') id: string, @Body('cityIds') cityIds: number[]) {
    return this.geographyService.removeCitiesFromCountry(Number(id), cityIds);
  }
}
