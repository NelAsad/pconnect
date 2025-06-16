// -----------------------------------------------------------------------------
// DTO de création de ville
// Définit la structure des données pour la création d'une ville
// Utilisé par l'endpoint POST /geography/cities
// -----------------------------------------------------------------------------
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {
  /**
   * Nom de la ville
   */
  @ApiProperty({ example: 'Paris', description: 'Nom de la ville' })
  name: string;

  /**
   * Identifiant du pays associé
   */
  @ApiProperty({ example: 1, description: 'ID du pays associé à la ville' })
  countryId: number;
}
