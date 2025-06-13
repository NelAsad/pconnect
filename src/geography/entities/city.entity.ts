import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CountryEntity } from './country.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity('cities')
export class CityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => CountryEntity, country => country.cities, { eager: true })
  country: CountryEntity;

  @OneToMany(() => UserEntity, user => user.city)
  users: UserEntity[];
}
