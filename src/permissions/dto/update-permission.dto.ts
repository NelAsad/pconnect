import { ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// DTO de mise à jour de permission
// Définit la structure des données pour la modification d'une permission
// Utilisé par l'endpoint PATCH /permissions/:id
// -----------------------------------------------------------------------------
export class UpdatePermissionDto {
  /**
   * Nouveau nom de la permission (optionnel)
   */
  @ApiPropertyOptional({ example: 'user.read', description: 'Nouveau nom de la permission' })
  name?: string;

  /**
   * Nouvelle description de la permission (optionnel)
   */
  @ApiPropertyOptional({ example: 'Permet de lire les utilisateurs', description: 'Nouvelle description de la permission' })
  description?: string;
}
