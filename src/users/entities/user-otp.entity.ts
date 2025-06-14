import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// -----------------------------------------------------------------------------
// Entité UserOtp
// Représente un code OTP associé à un utilisateur pour la validation d'email ou d'action.
// -----------------------------------------------------------------------------
@Entity('user_otps')
export class UserOtpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  otp: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  used: boolean;

  @Column({ type: 'timestamp', nullable: false })
  expiresAt: Date;
}
