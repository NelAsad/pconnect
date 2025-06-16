// -----------------------------------------------------------------------------
// DTO de mise à jour du profil utilisateur
// Définit la structure des données pour la modification du profil utilisateur.
// Utilisé par l'endpoint PATCH /users/me
// -----------------------------------------------------------------------------

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  /** Nom complet de l'utilisateur */
  @ApiPropertyOptional({ example: 'Jean Dupont', description: "Nom complet de l'utilisateur" })
  fullName?: string;

  /** Adresse e-mail de l'utilisateur */
  @ApiPropertyOptional({ example: 'jean.dupont@email.com', description: "Adresse e-mail de l'utilisateur" })
  email?: string;

  /** Description ou biographie de l'utilisateur */
  @ApiPropertyOptional({ example: 'Développeur passionné', description: 'Description ou biographie de l’utilisateur' })
  description?: string;

  // Ajoute d'autres champs modifiables par l'utilisateur si besoin
}
