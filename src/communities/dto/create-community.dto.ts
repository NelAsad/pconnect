// -----------------------------------------------------------------------------
// DTO de création de communauté
// Définit la structure des données pour la création d'une communauté
// Utilisé par l'endpoint POST /communities
// -----------------------------------------------------------------------------
export class CreateCommunityDto {
  /**
   * Nom de la communauté
   */
  name: string;
  /**
   * Slug (optionnel)
   */
  slug?: string;
  /**
   * Description de la communauté
   */
  description: string;
  /**
   * Logo (optionnel)
   */
  logo?: string;
  /**
   * Ville associée (optionnelle)
   */
  cityId?: number;
  /**
   * Pays associé (optionnel)
   */
  countryId?: number;
}
