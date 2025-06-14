// -----------------------------------------------------------------------------
// DTO d'attribution de permissions à un utilisateur
// Définit la structure des données pour l'ajout ou le retrait de permissions à un utilisateur.
// Utilisé par les endpoints POST/DELETE /users/:id/permissions
// -----------------------------------------------------------------------------

export class UserPermissionsDto {
  permissionIds: number[];
}
