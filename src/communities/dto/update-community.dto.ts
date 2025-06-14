// -----------------------------------------------------------------------------
// DTO de mise à jour de communauté
// Définit la structure des données pour la modification d'une communauté
// Utilisé par l'endpoint PATCH /communities/:id
// -----------------------------------------------------------------------------
export class UpdateCommunityDto {
  /**
   * Nom de la communauté (optionnel)
   */
  name?: string;
  /**
   * Slug (optionnel)
   */
  slug?: string;
  /**
   * Description (optionnel)
   */
  description?: string;
  /**
   * Logo (optionnel)
   */
  logo?: string;
  /**
   * Ville associée (optionnel)
   */
  cityId?: number;
  /**
   * Pays associé (optionnel)
   */
  countryId?: number;
}
