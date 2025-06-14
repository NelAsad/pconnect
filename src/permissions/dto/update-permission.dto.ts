// -----------------------------------------------------------------------------
// DTO de mise à jour de permission
// Définit la structure des données pour la modification d'une permission
// Utilisé par l'endpoint PATCH /permissions/:id
// -----------------------------------------------------------------------------
export class UpdatePermissionDto {
  /**
   * Nouveau nom de la permission (optionnel)
   */
  name?: string;
  /**
   * Nouvelle description de la permission (optionnel)
   */
  description?: string;
}
