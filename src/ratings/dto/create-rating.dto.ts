// -----------------------------------------------------------------------------
// DTO de création de note/évaluation (rating)
// Définit la structure des données pour la création d'une note
// Utilisé par l'endpoint POST /ratings
// -----------------------------------------------------------------------------
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRatingDto {
  /**
   * Valeur de la note (de 1 à 5)
   */
  @ApiProperty({ example: 5, minimum: 1, maximum: 5, description: 'Valeur de la note (de 1 à 5)' })
  note: number;

  /**
   * Commentaire associé à la note (optionnel)
   */
  @ApiPropertyOptional({ example: 'Très bon échange', description: 'Commentaire optionnel' })
  comment?: string;

  /**
   * ID de l’utilisateur émetteur (auteur de la note)
   */
  @ApiProperty({ example: 2, description: 'ID de l’utilisateur émetteur' })
  senderId: number;

  /**
   * ID de l’utilisateur destinataire (noté)
   */
  @ApiProperty({ example: 3, description: 'ID de l’utilisateur destinataire' })
  receiverId: number;

  /**
   * ID de l’annonce concernée (contexte de l’évaluation)
   */
  @ApiProperty({ example: 10, description: "ID de l'annonce concernée" })
  announcementId: number;
}
