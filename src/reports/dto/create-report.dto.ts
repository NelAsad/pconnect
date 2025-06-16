import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ enum: ReportTargetType, description: 'Type de cible du signalement (USER ou ANNOUNCEMENT)' })
  @IsEnum(ReportTargetType)
  targetType: ReportTargetType;

  /**
   * Identifiant de l'utilisateur signalé (si cible = USER).
   */
  @ApiPropertyOptional({ example: 2, description: 'ID de l’utilisateur signalé (si cible = USER)' })
  @IsOptional()
  @IsInt()
  targetUserId?: number;

  /**
   * Identifiant de l'annonce signalée (si cible = ANNOUNCEMENT).
   */
  @ApiPropertyOptional({ example: 5, description: 'ID de l’annonce signalée (si cible = ANNOUNCEMENT)' })
  @IsOptional()
  @IsInt()
  targetAnnouncementId?: number;

  /**
   * Motif du signalement (obligatoire).
   */
  @ApiProperty({ example: 'Spam', description: 'Motif du signalement' })
  @IsNotEmpty()
  @IsString()
  reason: string;

  /**
   * Description détaillée du signalement (optionnelle).
   */
  @ApiPropertyOptional({ example: 'Contenu inapproprié', description: 'Description détaillée du signalement' })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Identifiant de l'utilisateur auteur du signalement.
   */
  @ApiProperty({ example: 1, description: "ID de l'utilisateur auteur du signalement" })
  @IsInt()
  authorId: number;
}
