// -----------------------------------------------------------------------------
// DTO de mise à jour du profil utilisateur
// Définit la structure des données pour la modification du profil utilisateur.
// Utilisé par l'endpoint PATCH /users/me
// -----------------------------------------------------------------------------

export class UpdateProfileDto {
  fullName?: string;   // Nom complet de l'utilisateur
  email?: string;      // Adresse e-mail de l'utilisateur
  description?: string; // Description ou biographie de l'utilisateur
  // Ajoute d'autres champs modifiables par l'utilisateur si besoin
}
