// -----------------------------------------------------------------------------
// DTO de mise à jour de note/évaluation (rating)
// Définit la structure des données pour la modification d'une note
// Utilisé par l'endpoint PUT /ratings/:id
// -----------------------------------------------------------------------------
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRatingDto {
  /**
   * Nouvelle valeur de la note (de 1 à 5, optionnel)
   */
  @ApiPropertyOptional({ example: 4, minimum: 1, maximum: 5, description: 'Nouvelle valeur de la note (de 1 à 5)' })
  note?: number;

  /**
   * Nouveau commentaire (optionnel)
   */
  @ApiPropertyOptional({ example: 'Bon contact', description: 'Nouveau commentaire' })
  comment?: string;
}
