// src/users/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['role', 'role.permissions', 'permissions'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async findByEmail(_email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: _email },
      relations: ['role', 'role.permissions', 'permissions'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async update(userId: number, updateData: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: (userId) } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async create(dto: RegisterDto): Promise<UserEntity> {
    // Vérifie si l'email existe déjà
    const existing = await this.findByEmail(dto.email).catch(() => null);
    if (existing) throw new Error('Email déjà utilisé');

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Prépare les relations optionnelles
    let city = undefined;
    if (dto.cityId) {
      city = { id: dto.cityId };
    }
    let role = undefined;
    if (dto.roleId) {
      role = { id: dto.roleId };
    }

    // Création de l'utilisateur avec tous les champs
    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      description: dto.description,
      city,
      role,
    });
    return this.userRepository.save(user);
  }
}
