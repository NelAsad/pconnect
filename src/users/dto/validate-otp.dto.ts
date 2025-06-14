// -----------------------------------------------------------------------------
// DTO de validation OTP
// Définit la structure des données pour la validation d'un code OTP.
// Utilisé par l'endpoint POST /users/validate-otp
// -----------------------------------------------------------------------------
// Ce DTO contient deux propriétés :
// - email : l'adresse e-mail de l'utilisateur
// - otp : le code OTP à 6 chiffres
// -----------------------------------------------------------------------------

export class ValidateOtpDto {
  email: string;
  otp: string;
}
