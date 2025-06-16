// -----------------------------------------------------------------------------
// DTO de création de pays
// Définit la structure des données pour la création d'un pays
// Utilisé par l'endpoint POST /geography/countries
// -----------------------------------------------------------------------------
import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
  /**
   * Nom du pays (doit être unique)
   */
  @ApiProperty({ example: 'France', description: 'Nom du pays (unique)' })
  name: string;
}
