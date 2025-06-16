// -----------------------------------------------------------------------------
// Entité City (ville)
// Représente une ville dans la base de données
// Possède une relation ManyToOne avec Country et OneToMany avec User
// -----------------------------------------------------------------------------
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CountryEntity } from './country.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CommunityEntity } from 'src/communities/entities/community.entity';

@Entity('cities')
export class CityEntity {
  /**
   * Identifiant unique de la ville (clé primaire)
   */
  @ApiProperty({ example: 1, description: 'Identifiant unique de la ville' })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nom de la ville
   */
  @ApiProperty({ example: 'Paris', description: 'Nom de la ville' })
  @Column()
  name: string;

  /**
   * Pays associé à la ville (relation ManyToOne)
   */
  @ApiProperty({ type: () => CountryEntity, description: 'Pays associé à la ville', required: false })
  @ManyToOne(() => CountryEntity, country => country.cities, { eager: true })
  country: CountryEntity;

  /**
   * Liste des utilisateurs associés à cette ville
   */
  @ApiProperty({ type: () => [UserEntity], description: 'Utilisateurs associés à cette ville', required: false })
  @OneToMany(() => UserEntity, user => user.city)
  users: UserEntity[];

  /**
   * Liste des communautés associées à cette ville
   */
  @ApiProperty({ type: () => [CommunityEntity], description: 'Communautés associées à cette ville', required: false })
  @OneToMany(() => CommunityEntity, community => community.city)
  communities: CommunityEntity[];
}
