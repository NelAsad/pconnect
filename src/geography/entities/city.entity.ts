// -----------------------------------------------------------------------------
// Entité City (ville)
// Représente une ville dans la base de données
// Possède une relation ManyToOne avec Country et OneToMany avec User
// -----------------------------------------------------------------------------
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CountryEntity } from './country.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity('cities')
export class CityEntity {
  /**
   * Identifiant unique de la ville (clé primaire)
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nom de la ville
   */
  @Column()
  name: string;

  /**
   * Pays associé à la ville (relation ManyToOne)
   */
  @ManyToOne(() => CountryEntity, country => country.cities, { eager: true })
  country: CountryEntity;

  /**
   * Liste des utilisateurs associés à cette ville
   */
  @OneToMany(() => UserEntity, user => user.city)
  users: UserEntity[];
}
