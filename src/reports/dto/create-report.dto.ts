import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReportTargetType } from '../entities/report.entity';

/**
 * DTO pour la création d'un signalement (report).
 * Permet de signaler un utilisateur ou une annonce avec un motif et une description optionnelle.
 * Utilisé dans l'endpoint POST /reports.
 */
export class CreateReportDto {
  /**
   * Type de cible du signalement (utilisateur ou annonce).
   */
  @IsEnum(ReportTargetType)
  targetType: ReportTargetType;

  /**
   * Identifiant de l'utilisateur signalé (si cible = USER).
   */
  @IsOptional()
  @IsInt()
  targetUserId?: number;

  /**
   * Identifiant de l'annonce signalée (si cible = ANNOUNCEMENT).
   */
  @IsOptional()
  @IsInt()
  targetAnnouncementId?: number;

  /**
   * Motif du signalement (obligatoire).
   */
  @IsNotEmpty()
  @IsString()
  reason: string;

  /**
   * Description détaillée du signalement (optionnelle).
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Identifiant de l'utilisateur auteur du signalement.
   */
  @IsInt()
  authorId: number;
}
