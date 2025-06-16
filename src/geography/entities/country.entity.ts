// -----------------------------------------------------------------------------
// Entité Country (pays)
// Représente un pays dans la base de données
// Possède une relation OneToMany avec les villes (CityEntity)
// -----------------------------------------------------------------------------
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from './city.entity';
import { CommunityEntity } from 'src/communities/entities/community.entity';

@Entity('countries')
export class CountryEntity {
  /**
   * Identifiant unique du pays (clé primaire)
   */
  @ApiProperty({ example: 1, description: 'Identifiant unique du pays' })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nom du pays (unique)
   */
  @ApiProperty({ example: 'France', description: 'Nom du pays (unique)' })
  @Column({ unique: true })
  name: string;

  /**
   * Liste des villes associées à ce pays
   */
  @ApiProperty({ type: () => [CityEntity], description: 'Villes associées à ce pays', required: false })
  @OneToMany(() => CityEntity, city => city.country)
  cities: CityEntity[];

  /**
   * Liste des communautés associées à ce pays
   */
  @ApiProperty({ type: () => [CommunityEntity], description: 'Communautés associées à ce pays', required: false })
  @OneToMany(() => CommunityEntity, community => community.country)
  communities: CommunityEntity[];
}
