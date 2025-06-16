// -----------------------------------------------------------------------------
// Contrôleur de gestion géographique (endpoints pays/villes)
// Expose les routes pour la gestion CRUD des pays et des villes
// Utilise le service GeographyService pour la logique métier
// -----------------------------------------------------------------------------
import { Controller, Body, Param, Get, Post, Patch, Delete } from '@nestjs/common';
import { GeographyService } from './geography.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CountryEntity } from './entities/country.entity';
import { CityEntity } from './entities/city.entity';

@ApiTags('Geography')
@Controller('geography')
export class GeographyController {
  constructor(private readonly geographyService: GeographyService) {}

  // --- Country ---
  /**
   * Crée un pays
   * @param data Données du pays à créer
   */
  @ApiOperation({ summary: 'Créer un pays' })
  @ApiBody({ type: CreateCountryDto })
  @ApiResponse({ status: 201, description: 'Pays créé', type: CountryEntity })
  @Post('countries')
  createCountry(@Body() data: CreateCountryDto) {
    return this.geographyService.createCountry(data);
  }

  /**
   * Liste tous les pays
   */
  @ApiOperation({ summary: 'Lister tous les pays' })
  @ApiResponse({ status: 200, description: 'Liste des pays', type: [CountryEntity] })
  @Get('countries')
  findAllCountries() {
    return this.geographyService.findAllCountries();
  }

  /**
   * Récupère un pays par son id
   */
  @ApiOperation({ summary: 'Récupérer un pays par son id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Pays trouvé', type: CountryEntity })
  @Get('countries/:id')
  findCountryById(@Param('id') id: string) {
    return this.geographyService.findCountryById(Number(id));
  }

  /**
   * Met à jour un pays
   */
  @ApiOperation({ summary: 'Mettre à jour un pays' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCountryDto })
  @ApiResponse({ status: 200, description: 'Pays mis à jour', type: CountryEntity })
  @Patch('countries/:id')
  updateCountry(@Param('id') id: string, @Body() data: UpdateCountryDto) {
    return this.geographyService.updateCountry(Number(id), data);
  }

  /**
   * Supprime un pays
   */
  @ApiOperation({ summary: 'Supprimer un pays' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Pays supprimé' })
  @Delete('countries/:id')
  removeCountry(@Param('id') id: string) {
    return this.geographyService.removeCountry(Number(id));
  }

  // --- City ---
  /**
   * Crée une ville
   * @param data Données de la ville à créer
   */
  @ApiOperation({ summary: 'Créer une ville' })
  @ApiBody({ type: CreateCityDto })
  @ApiResponse({ status: 201, description: 'Ville créée', type: CityEntity })
  @Post('cities')
  createCity(@Body() data: CreateCityDto) {
    return this.geographyService.createCity(data);
  }

  /**
   * Liste toutes les villes
   */
  @ApiOperation({ summary: 'Lister toutes les villes' })
  @ApiResponse({ status: 200, description: 'Liste des villes', type: [CityEntity] })
  @Get('cities')
  findAllCities() {
    return this.geographyService.findAllCities();
  }

  /**
   * Récupère une ville par son id
   */
  @ApiOperation({ summary: 'Récupérer une ville par son id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Ville trouvée', type: CityEntity })
  @Get('cities/:id')
  findCityById(@Param('id') id: string) {
    return this.geographyService.findCityById(Number(id));
  }

  /**
   * Met à jour une ville
   */
  @ApiOperation({ summary: 'Mettre à jour une ville' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCityDto })
  @ApiResponse({ status: 200, description: 'Ville mise à jour', type: CityEntity })
  @Patch('cities/:id')
  updateCity(@Param('id') id: string, @Body() data: UpdateCityDto) {
    return this.geographyService.updateCity(Number(id), data);
  }

  /**
   * Supprime une ville
   */
  @ApiOperation({ summary: 'Supprimer une ville' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Ville supprimée' })
  @Delete('cities/:id')
  removeCity(@Param('id') id: string) {
    return this.geographyService.removeCity(Number(id));
  }

  // --- Country-City Relationships ---
  /**
   * Ajoute plusieurs villes à un pays
   */
  @ApiOperation({ summary: 'Associer plusieurs villes à un pays' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: { properties: { cityIds: { type: 'array', items: { type: 'number' }, example: [1,2] } } } })
  @ApiResponse({ status: 200, description: 'Villes associées au pays', type: CountryEntity })
  @Post('countries/:id/cities')
  addCitiesToCountry(@Param('id') id: string, @Body('cityIds') cityIds: number[]) {
    return this.geographyService.addCitiesToCountry(Number(id), cityIds);
  }

  /**
   * Retire plusieurs villes d'un pays
   */
  @ApiOperation({ summary: 'Dissocier plusieurs villes d’un pays' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: { properties: { cityIds: { type: 'array', items: { type: 'number' }, example: [1,2] } } } })
  @ApiResponse({ status: 200, description: 'Villes dissociées du pays', type: CountryEntity })
  @Delete('countries/:id/cities')
  removeCitiesFromCountry(@Param('id') id: string, @Body('cityIds') cityIds: number[]) {
    return this.geographyService.removeCitiesFromCountry(Number(id), cityIds);
  }
}
