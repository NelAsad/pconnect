// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsNotEmpty({ message: 'Mot de passe requis' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  @IsNotEmpty({ message: 'Nom complet requis' })
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  cityId?: number;

  @IsOptional()
  roleId?: number;

  // permissions et autres relations sont optionnelles à l'inscription
}
