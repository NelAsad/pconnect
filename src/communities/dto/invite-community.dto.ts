import { IsEmail } from 'class-validator';

export class InviteCommunityDto {
  @IsEmail()
  email: string;
}
