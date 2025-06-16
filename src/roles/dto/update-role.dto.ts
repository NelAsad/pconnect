import { ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// DTO de mise à jour de rôle
// Définit la structure des données pour la modification d'un rôle
// Utilisé par l'endpoint PATCH /roles/:id
// -----------------------------------------------------------------------------
export class UpdateRoleDto {
  /**
   * Nouveau nom du rôle (optionnel)
   */
  @ApiPropertyOptional({ example: 'admin', description: 'Nouveau nom du rôle' })
  name?: string;

  /**
   * Nouvelle description du rôle (optionnel)
   */
  @ApiPropertyOptional({ example: 'Administrateur de la plateforme', description: 'Nouvelle description du rôle' })
  description?: string;

  /**
   * Liste des identifiants de permissions à associer (optionnel)
   */
  @ApiPropertyOptional({ type: [Number], example: [1, 2], description: 'Liste des IDs de permissions à associer' })
  permissionIds?: number[];
}
