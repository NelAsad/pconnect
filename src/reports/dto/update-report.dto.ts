// -----------------------------------------------------------------------------
// DTO de mise à jour de signalement (report)
// Définit la structure des données pour la modification d'un signalement
// Utilisé par l'endpoint PATCH /reports/:id (si besoin)
// -----------------------------------------------------------------------------
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ReportTargetType } from '../entities/report.entity';

export class UpdateReportDto {
  /**
   * Nouveau type de cible du signalement (optionnel)
   */
  @ApiPropertyOptional({ enum: ReportTargetType, description: 'Type de cible du signalement (USER ou ANNOUNCEMENT)' })
  targetType?: ReportTargetType;

  /**
   * Nouvel identifiant de l’utilisateur signalé (optionnel)
   */
  @ApiPropertyOptional({ example: 2, description: 'ID de l’utilisateur signalé' })
  targetUserId?: number;

  /**
   * Nouvel identifiant de l’annonce signalée (optionnel)
   */
  @ApiPropertyOptional({ example: 5, description: 'ID de l’annonce signalée' })
  targetAnnouncementId?: number;

  /**
   * Nouveau motif du signalement (optionnel)
   */
  @ApiPropertyOptional({ example: 'Spam', description: 'Motif du signalement' })
  reason?: string;

  /**
   * Nouvelle description détaillée (optionnel)
   */
  @ApiPropertyOptional({ example: 'Contenu inapproprié', description: 'Description détaillée du signalement' })
  description?: string;
}
