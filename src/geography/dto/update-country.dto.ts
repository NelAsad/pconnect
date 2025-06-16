// -----------------------------------------------------------------------------
// DTO de mise à jour de pays
// Définit la structure des données pour la modification d'un pays
// Utilisé par l'endpoint PATCH /geography/countries/:id
// -----------------------------------------------------------------------------
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCountryDto {
  /**
   * Nom du pays (optionnel)
   */
  @ApiPropertyOptional({ example: 'France', description: 'Nom du pays (unique)' })
  name?: string;
}
