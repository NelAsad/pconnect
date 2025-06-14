// -----------------------------------------------------------------------------
// DTO de connexion utilisateur
// Définit la structure et les règles de validation pour la connexion
// Utilisé par l'endpoint POST /auth/login
// -----------------------------------------------------------------------------
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  /**
   * Email de l'utilisateur
   * Doit être une adresse email valide
   */
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  /**
   * Mot de passe de l'utilisateur
   * Champ requis
   */
  @IsNotEmpty({ message: 'Mot de passe requis' })
  password: string;
}
