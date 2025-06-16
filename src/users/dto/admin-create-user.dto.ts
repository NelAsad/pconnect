import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// DTO de création d'utilisateur par l'admin
// Définit la structure des données pour la création d'un utilisateur par un administrateur.
// Utilisé par l'endpoint POST /users (admin)
// -----------------------------------------------------------------------------

export class AdminCreateUserDto {
  /** Adresse e-mail de l'utilisateur */
  @ApiProperty({ example: 'user@email.com', description: "Adresse e-mail de l'utilisateur" })
  email: string;
  /** Nom complet de l'utilisateur */
  @ApiProperty({ example: 'Jean Dupont', description: "Nom complet de l'utilisateur" })
  fullName: string;
  /** Mot de passe de l'utilisateur */
  @ApiProperty({ example: '********', description: 'Mot de passe de l’utilisateur' })
  password: string;
  /** Description de l'utilisateur (facultatif) */
  @ApiPropertyOptional({ example: 'Développeur passionné', description: 'Description ou biographie de l’utilisateur' })
  description?: string;
  /** Identifiant de la ville de l'utilisateur (facultatif) */
  @ApiPropertyOptional({ example: 1, description: 'ID de la ville de l’utilisateur' })
  cityId?: number;
  /** Identifiant du rôle de l'utilisateur (facultatif) */
  @ApiPropertyOptional({ example: 2, description: 'ID du rôle de l’utilisateur' })
  roleId?: number;
  /** Indique si l'utilisateur est visible (facultatif) */
  @ApiPropertyOptional({ example: true, description: 'Utilisateur visible ?' })
  isVisible?: boolean;
}
