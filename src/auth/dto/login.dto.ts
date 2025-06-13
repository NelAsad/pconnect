// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsNotEmpty({ message: 'Mot de passe requis' })
  password: string;
}
