// -----------------------------------------------------------------------------
// DTO d'attribution de rôle à un utilisateur
// Définit la structure des données pour l'attribution d'un rôle à un utilisateur.
// Utilisé par l'endpoint POST /users/:id/role
// -----------------------------------------------------------------------------

export class UserRoleDto {
  roleId: number;
}
