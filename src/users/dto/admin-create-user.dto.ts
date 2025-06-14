// -----------------------------------------------------------------------------
// DTO de création d'utilisateur par l'admin
// Définit la structure des données pour la création d'un utilisateur par un administrateur.
// Utilisé par l'endpoint POST /users (admin)
// -----------------------------------------------------------------------------

export class AdminCreateUserDto {
  email: string; // Adresse e-mail de l'utilisateur
  fullName: string; // Nom complet de l'utilisateur
  password: string; // Mot de passe de l'utilisateur
  description?: string; // Description de l'utilisateur (facultatif)
  cityId?: number; // Identifiant de la ville de l'utilisateur (facultatif)
  roleId?: number; // Identifiant du rôle de l'utilisateur (facultatif)
  isVisible?: boolean; // Indique si l'utilisateur est visible (facultatif)
}
