import { IsOptional, IsString, IsEnum, IsBoolean, IsInt } from 'class-validator';
import { AnnouncementType } from '../entities/announcement.entity';

/**
 * DTO de recherche avancée pour les annonces.
 * Permet de filtrer les résultats sur plusieurs critères (mot-clé, type, catégorie, publication, utilisateur, communauté, dates, pagination).
 * Utilisé dans l'endpoint GET /announcements/search.
 */
export class SearchAnnouncementDto {
  /**
   * Mot-clé à rechercher dans le titre ou la description de l'annonce.
   */
  @IsOptional()
  @IsString()
  keyword?: string;

  /**
   * Type d'annonce (enum : OFFER, REQUEST, etc.).
   */
  @IsOptional()
  @IsEnum(AnnouncementType)
  type?: AnnouncementType;

  /**
   * Identifiant de la catégorie à filtrer.
   */
  @IsOptional()
  @IsInt()
  categoryId?: number;

  /**
   * Filtre sur le statut de publication (publiée ou non).
   */
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  /**
   * Identifiant de l'utilisateur auteur de l'annonce.
   */
  @IsOptional()
  @IsInt()
  userId?: number;

  /**
   * Identifiant de la communauté liée à l'annonce.
   */
  @IsOptional()
  @IsInt()
  communityId?: number;

  /**
   * Page de pagination (défaut : 1).
   */
  @IsOptional()
  @IsInt()
  page?: number;

  /**
   * Nombre d'éléments par page (défaut : 10).
   */
  @IsOptional()
  @IsInt()
  limit?: number;

  /**
   * Date de création minimale (format ISO ou yyyy-mm-dd).
   */
  @IsOptional()
  @IsString()
  createdAtMin?: string; // format ISO ou yyyy-mm-dd

  /**
   * Date de création maximale (format ISO ou yyyy-mm-dd).
   */
  @IsOptional()
  @IsString()
  createdAtMax?: string; // format ISO ou yyyy-mm-dd
}
