import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CityEntity } from './city.entity';

@Entity('countries')
export class CountryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => CityEntity, city => city.country)
  cities: CityEntity[];
}
