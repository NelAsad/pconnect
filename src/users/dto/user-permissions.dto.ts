// -----------------------------------------------------------------------------
// DTO d'attribution de permissions à un utilisateur
// Définit la structure des données pour l'ajout ou le retrait de permissions à un utilisateur.
// Utilisé par les endpoints POST/DELETE /users/:id/permissions
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

export class UserPermissionsDto {
  /**
   * Liste des identifiants de permissions à associer ou retirer
   */
  @ApiProperty({ type: [Number], example: [1, 2], description: 'Liste des IDs de permissions à associer ou retirer' })
  permissionIds: number[];
}
