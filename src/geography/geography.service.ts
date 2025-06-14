// -----------------------------------------------------------------------------
// Service de gestion géographique (pays, villes)
// Fournit les opérations CRUD pour les entités Country et City
// Centralise la logique métier liée à la géographie
// -----------------------------------------------------------------------------
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from './entities/city.entity';
import { CountryEntity } from './entities/country.entity';

@Injectable()
export class GeographyService {
  constructor(
    @InjectRepository(CityEntity)
    private cityRepository: Repository<CityEntity>,
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>,
  ) {}

  /**
   * Crée un nouveau pays
   * @param data Données du pays à créer
   * @returns Le pays créé
   */
  async createCountry(data: Partial<CountryEntity>): Promise<CountryEntity> {
    return this.countryRepository.save(this.countryRepository.create(data));
  }

  /**
   * Retourne la liste de tous les pays avec leurs villes
   */
  async findAllCountries(): Promise<CountryEntity[]> {
    return this.countryRepository.find({ relations: ['cities'] });
  }

  /**
   * Retourne un pays par son id avec ses villes
   */
  async findCountryById(id: number): Promise<CountryEntity> {
    return this.countryRepository.findOne({ where: { id }, relations: ['cities'] });
  }

  /**
   * Met à jour un pays
   */
  async updateCountry(id: number, data: Partial<CountryEntity>): Promise<CountryEntity> {
    await this.countryRepository.update(id, data);
    return this.findCountryById(id);
  }

  /**
   * Supprime un pays
   */
  async removeCountry(id: number): Promise<void> {
    await this.countryRepository.delete(id);
  }

  /**
   * Crée une nouvelle ville (city), optionnellement liée à un pays
   */
  async createCity(data: Partial<CityEntity>): Promise<CityEntity> {
    let country = undefined;
    if (data.country && typeof data.country === 'number') {
      country = await this.countryRepository.findOne({ where: { id: data.country } });
      if (!country) throw new Error('Country not found');
    } else if (data.country) {
      country = data.country;
    }
    return this.cityRepository.save(this.cityRepository.create({ ...data, country }));
  }

  /**
   * Retourne la liste de toutes les villes avec leur pays et utilisateurs
   */
  async findAllCities(): Promise<CityEntity[]> {
    return this.cityRepository.find({ relations: ['country', 'users'] });
  }

  /**
   * Retourne une ville par son id avec son pays et ses utilisateurs
   */
  async findCityById(id: number): Promise<CityEntity> {
    return this.cityRepository.findOne({ where: { id }, relations: ['country', 'users'] });
  }

  /**
   * Met à jour une ville
   */
  async updateCity(id: number, data: Partial<CityEntity>): Promise<CityEntity> {
    let country = undefined;
    if (data.country && typeof data.country === 'number') {
      country = await this.countryRepository.findOne({ where: { id: data.country } });
      if (!country) throw new Error('Country not found');
    } else if (data.country) {
      country = data.country;
    }
    await this.cityRepository.update(id, { ...data, country });
    return this.findCityById(id);
  }

  /**
   * Supprime une ville
   */
  async removeCity(id: number): Promise<void> {
    await this.cityRepository.delete(id);
  }

  /**
   * Ajoute plusieurs villes à un pays
   */
  async addCitiesToCountry(countryId: number, cityIds: number[]): Promise<CountryEntity> {
    const country = await this.countryRepository.findOne({ where: { id: countryId }, relations: ['cities'] });
    if (!country) throw new Error('Country not found');
    const cities = await this.cityRepository.findByIds(cityIds);
    country.cities = Array.from(new Set([...(country.cities || []), ...cities]));
    return this.countryRepository.save(country);
  }

  /**
   * Retire plusieurs villes d'un pays
   */
  async removeCitiesFromCountry(countryId: number, cityIds: number[]): Promise<CountryEntity> {
    const country = await this.countryRepository.findOne({ where: { id: countryId }, relations: ['cities'] });
    if (!country) throw new Error('Country not found');
    country.cities = (country.cities || []).filter(city => !cityIds.includes(city.id));
    return this.countryRepository.save(country);
  }
}
