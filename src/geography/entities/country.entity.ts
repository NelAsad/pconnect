// -----------------------------------------------------------------------------
// Entité Country (pays)
// Représente un pays dans la base de données
// Possède une relation OneToMany avec les villes (CityEntity)
// -----------------------------------------------------------------------------
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CityEntity } from './city.entity';

@Entity('countries')
export class CountryEntity {
  /**
   * Identifiant unique du pays (clé primaire)
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nom du pays (unique)
   */
  @Column({ unique: true })
  name: string;

  /**
   * Liste des villes associées à ce pays
   */
  @OneToMany(() => CityEntity, city => city.country)
  cities: CityEntity[];
}
