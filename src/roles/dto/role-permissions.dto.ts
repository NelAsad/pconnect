import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// DTO d'association de permissions à un rôle
// Définit la structure des données pour l'ajout ou le retrait de permissions
// Utilisé par les endpoints POST/DELETE /roles/:id/permissions
// -----------------------------------------------------------------------------
export class RolePermissionsDto {
  /**
   * Liste des identifiants de permissions à associer ou retirer
   */
  @ApiProperty({ type: [Number], example: [1, 2], description: 'Liste des IDs de permissions à associer ou retirer' })
  permissionIds: number[];
}
