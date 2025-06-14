// -----------------------------------------------------------------------------
// DTO de mise à jour de rôle
// Définit la structure des données pour la modification d'un rôle
// Utilisé par l'endpoint PATCH /roles/:id
// -----------------------------------------------------------------------------
export class UpdateRoleDto {
  /**
   * Nouveau nom du rôle (optionnel)
   */
  name?: string;
  /**
   * Nouvelle description du rôle (optionnel)
   */
  description?: string;
  /**
   * Liste des identifiants de permissions à associer (optionnel)
   */
  permissionIds?: number[];
}
