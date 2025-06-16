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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  /**
   * Email de l'utilisateur
   * Doit être une adresse email valide
   */
  @ApiProperty({ description: "Email de l'utilisateur", example: "user@email.com" })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  /**
   * Mot de passe de l'utilisateur
   * Doit contenir au moins 6 caractères
   */
  @ApiProperty({ description: "Mot de passe de l'utilisateur (min 6 caractères)", example: "password123" })
  @IsNotEmpty({ message: 'Mot de passe requis' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  /**
   * Nom complet de l'utilisateur
   */
  @ApiProperty({ description: "Nom complet de l'utilisateur", example: "Jean Dupont" })
  @IsNotEmpty({ message: 'Nom complet requis' })
  @IsString()
  fullName: string;

  /**
   * Description optionnelle du profil
   */
  @ApiPropertyOptional({ description: 'Description optionnelle du profil', example: 'Développeur passionné.' })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Identifiant de la ville (optionnel)
   */
  @ApiPropertyOptional({ description: 'Identifiant de la ville', example: 42 })
  @IsOptional()
  cityId?: number;

  /**
   * Identifiant du rôle (optionnel)
   */
  @ApiPropertyOptional({ description: 'Identifiant du rôle', example: 3 })
  @IsOptional()
  roleId?: number;

  // permissions et autres relations sont optionnelles à l'inscription
}
