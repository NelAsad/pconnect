// -----------------------------------------------------------------------------
// DTO de connexion utilisateur
// Définit la structure et les règles de validation pour la connexion
// Utilisé par l'endpoint POST /auth/login
// -----------------------------------------------------------------------------
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  /**
   * Email de l'utilisateur
   * Doit être une adresse email valide
   */
  @ApiProperty({ description: "Email de l'utilisateur", example: "user@email.com" })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  /**
   * Mot de passe de l'utilisateur
   * Champ requis
   */
  @ApiProperty({ description: "Mot de passe de l'utilisateur", example: "password123" })
  @IsNotEmpty({ message: 'Mot de passe requis' })
  password: string;
}
