// -----------------------------------------------------------------------------
// DTO de mise à jour de ville
// Définit la structure des données pour la modification d'une ville
// Utilisé par l'endpoint PATCH /geography/cities/:id
// -----------------------------------------------------------------------------
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCityDto {
  /**
   * Nom de la ville (optionnel)
   */
  @ApiPropertyOptional({ example: 'Paris', description: 'Nom de la ville' })
  name?: string;

  /**
   * Identifiant du pays associé (optionnel)
   */
  @ApiPropertyOptional({ example: 1, description: 'ID du pays associé à la ville' })
  countryId?: number;
}
