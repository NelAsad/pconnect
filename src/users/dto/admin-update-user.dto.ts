// -----------------------------------------------------------------------------
// DTO de mise à jour d'utilisateur par l'admin
// Définit la structure des données pour la modification d'un utilisateur par un administrateur.
// Utilisé par l'endpoint PATCH /users/:id (admin)
// -----------------------------------------------------------------------------

export class AdminUpdateUserDto {
  /** Adresse email de l'utilisateur */
  email?: string;

  /** Nom complet de l'utilisateur */
  fullName?: string;

  /** Description ou biographie de l'utilisateur */
  description?: string;

  /** Identifiant de la ville de l'utilisateur */
  cityId?: number;

  /** Identifiant du rôle de l'utilisateur */
  roleId?: number;

  /** Indique si l'utilisateur est actif */
  isActive?: boolean;

  /** Indique si l'utilisateur est visible par les autres utilisateurs */
  isVisible?: boolean;
}
