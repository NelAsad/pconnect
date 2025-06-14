// -----------------------------------------------------------------------------
// DTO de création de rôle
// Définit la structure des données pour la création d'un rôle
// Utilisé par l'endpoint POST /roles
// -----------------------------------------------------------------------------
export class CreateRoleDto {
  /**
   * Nom unique du rôle
   */
  name: string;
  /**
   * Description optionnelle du rôle
   */
  description?: string;
  /**
   * Liste des identifiants de permissions à associer (optionnel)
   */
  permissionIds?: number[];
}
