import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// DTO de création de rôle
// Définit la structure des données pour la création d'un rôle
// Utilisé par l'endpoint POST /roles
// -----------------------------------------------------------------------------
export class CreateRoleDto {
  /**
   * Nom unique du rôle
   */
  @ApiProperty({ example: 'admin', description: 'Nom unique du rôle' })
  name: string;

  /**
   * Description optionnelle du rôle
   */
  @ApiPropertyOptional({ example: 'Administrateur de la plateforme', description: 'Description optionnelle du rôle' })
  description?: string;

  /**
   * Liste des identifiants de permissions à associer (optionnel)
   */
  @ApiPropertyOptional({ type: [Number], example: [1, 2], description: 'Liste des IDs de permissions à associer' })
  permissionIds?: number[];
}
