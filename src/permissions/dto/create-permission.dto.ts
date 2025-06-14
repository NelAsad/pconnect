// -----------------------------------------------------------------------------
// DTO de création de permission
// Définit la structure des données pour la création d'une permission
// Utilisé par l'endpoint POST /permissions
// -----------------------------------------------------------------------------
export class CreatePermissionDto {
  /**
   * Nom unique de la permission
   */
  name: string;
  /**
   * Description optionnelle de la permission
   */
  description?: string;
}
