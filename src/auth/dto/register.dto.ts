// -----------------------------------------------------------------------------
// DTO d'inscription utilisateur
// Définit la structure et les règles de validation pour l'inscription
// Utilisé par l'endpoint POST /auth/register
// -----------------------------------------------------------------------------
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  /**
   * Email de l'utilisateur
   * Doit être une adresse email valide
   */
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  /**
   * Mot de passe de l'utilisateur
   * Doit contenir au moins 6 caractères
   */
  @IsNotEmpty({ message: 'Mot de passe requis' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  /**
   * Nom complet de l'utilisateur
   */
  @IsNotEmpty({ message: 'Nom complet requis' })
  @IsString()
  fullName: string;

  /**
   * Description optionnelle du profil
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Identifiant de la ville (optionnel)
   */
  @IsOptional()
  cityId?: number;

  /**
   * Identifiant du rôle (optionnel)
   */
  @IsOptional()
  roleId?: number;

  // permissions et autres relations sont optionnelles à l'inscription
}
