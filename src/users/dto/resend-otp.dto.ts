// -----------------------------------------------------------------------------
// DTO de renvoi OTP
// Définit la structure des données pour le renvoi d'un code OTP à un utilisateur.
// Utilisé par l'endpoint POST /users/resend-otp
// -----------------------------------------------------------------------------

export class ResendOtpDto {
  email: string;
}
