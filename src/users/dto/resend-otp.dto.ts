// -----------------------------------------------------------------------------
// DTO de renvoi OTP
// Définit la structure des données pour le renvoi d'un code OTP à un utilisateur.
// Utilisé par l'endpoint POST /users/resend-otp
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpDto {
  /**
   * Adresse e-mail de l'utilisateur
   */
  @ApiProperty({ example: 'user@email.com', description: "Adresse e-mail de l'utilisateur" })
  email: string;
}
