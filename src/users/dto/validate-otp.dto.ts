// -----------------------------------------------------------------------------
// DTO de validation OTP
// Définit la structure des données pour la validation d'un code OTP.
// Utilisé par l'endpoint POST /users/validate-otp
// -----------------------------------------------------------------------------
// Ce DTO contient deux propriétés :
// - email : l'adresse e-mail de l'utilisateur
// - otp : le code OTP à 6 chiffres
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

export class ValidateOtpDto {
  /**
   * Adresse e-mail de l'utilisateur
   */
  @ApiProperty({ example: 'user@email.com', description: "Adresse e-mail de l'utilisateur" })
  email: string;

  /**
   * Code OTP à 6 chiffres
   */
  @ApiProperty({ example: '123456', description: 'Code OTP à 6 chiffres' })
  otp: string;
}
