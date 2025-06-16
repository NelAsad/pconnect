// -----------------------------------------------------------------------------
// DTO d'attribution de rôle à un utilisateur
// Définit la structure des données pour l'attribution d'un rôle à un utilisateur.
// Utilisé par l'endpoint POST /users/:id/role
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

export class UserRoleDto {
  /**
   * Identifiant du rôle à attribuer à l'utilisateur
   */
  @ApiProperty({ example: 2, description: 'ID du rôle à attribuer' })
  roleId: number;
}
