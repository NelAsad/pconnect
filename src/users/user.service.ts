// src/users/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UserOtpEntity } from './entities/user-otp.entity';
import { MailService } from 'src/common/mail/mail.service';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { CityEntity } from 'src/geography/entities/city.entity';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Pagination, IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

// -----------------------------------------------------------------------------
// Service de gestion des utilisateurs
// Fournit toutes les opérations liées aux utilisateurs : création, lecture, mise à jour, suppression,
// gestion OTP, gestion des rôles et permissions, gestion du profil, pagination, upload de photo, etc.
// Centralise la logique métier utilisateur pour l'application.
// -----------------------------------------------------------------------------
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(UserOtpEntity)
    private userOtpRepository: Repository<UserOtpEntity>,

    private mailService: MailService,

    @InjectRepository(CityEntity)
    private cityRepository: Repository<CityEntity>,

    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  /**
   * Trouve un utilisateur par son identifiant.
   * @param id - L'identifiant de l'utilisateur à rechercher.
   * @returns L'utilisateur correspondant à l'identifiant fourni.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   */
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

  /**
   * Trouve un utilisateur par son adresse e-mail.
   * @param _email - L'adresse e-mail de l'utilisateur à rechercher.
   * @returns L'utilisateur correspondant à l'adresse e-mail fournie.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   */
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

  /**
   * Met à jour les données d'un utilisateur.
   * @param userId - L'identifiant de l'utilisateur à mettre à jour.
   * @param updateData - Les données à mettre à jour.
   * @returns L'utilisateur mis à jour.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   */
  async update(userId: number, updateData: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: (userId) } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  /**
   * Crée un nouvel utilisateur et envoie un OTP pour validation.
   * @param dto - Les données d'inscription de l'utilisateur.
   * @returns L'utilisateur créé.
   * @throws Error si l'e-mail est déjà utilisé.
   */
  async create(dto: RegisterDto): Promise<UserEntity> {
    // Vérifie si l'email existe déjà
    const existing = await this.findByEmail(dto.email).catch(() => null);
    if (existing) throw new Error('Email déjà utilisé');

    // Invalide tous les anciens OTP non utilisés pour cet email
    await this.userOtpRepository.update({ email: dto.email, used: false }, { used: true });

    // Génère un OTP à 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Stocke l'OTP en base avec expiration
    await this.userOtpRepository.save({ email: dto.email, otp, expiresAt });

    // Envoie l'OTP par mail
    await this.mailService.sendOtp(dto.email, otp);

    // Création de l'utilisateur en mode inactif
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    let city = undefined;
    if (dto.cityId) city = { id: dto.cityId };
    let role = undefined;
    if (dto.roleId) role = { id: dto.roleId };
    
    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      description: dto.description,
      city,
      role,
      isActive: false,
    });
    return this.userRepository.save(user);
  }

  /**
   * Valide un OTP pour un utilisateur et active son compte si nécessaire.
   * @param email - L'adresse e-mail de l'utilisateur.
   * @param otp - Le OTP à valider.
   * @returns Un objet indiquant le succès de l'opération et un message associé.
   */
  async validateOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const userOtp = await this.userOtpRepository.findOne({
      where: { email, otp, used: false },
    });
    if (!userOtp) {
      return { success: false, message: 'OTP invalide ou déjà utilisé.' };
    }
    if (userOtp.expiresAt < new Date()) {
      return { success: false, message: 'OTP expiré.' };
    }
    userOtp.used = true;
    await this.userOtpRepository.save(userOtp);
    // Active l'utilisateur si besoin
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && !user.isActive) {
      user.isActive = true;
      await this.userRepository.save(user);
    }
    return { success: true, message: 'OTP validé avec succès.' };
  }

  /**
   * Renvoie un nouvel OTP à un utilisateur.
   * @param email - L'adresse e-mail de l'utilisateur.
   * @returns Un objet indiquant le succès de l'opération et un message associé.
   */
  async resendOtp(email: string): Promise<{ success: boolean; message: string }> {
    // Vérifie si l'utilisateur existe
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return { success: false, message: "Utilisateur non trouvé." };
    }
    // Invalide tous les anciens OTP non utilisés
    await this.userOtpRepository.update({ email, used: false }, { used: true });
    // Génère un nouvel OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.userOtpRepository.save({ email, otp, expiresAt });
    // Envoie l'OTP par mail avec le template adapté
    await this.mailService.sendResendOtp(email, otp);
    return { success: true, message: "OTP renvoyé avec succès." };
  }

  /**
   * Ajoute des permissions à un utilisateur.
   * @param userId - L'identifiant de l'utilisateur.
   * @param permissionIds - Les identifiants des permissions à ajouter.
   * @returns L'utilisateur mis à jour avec les nouvelles permissions.
   * @throws NotFoundException si l'utilisateur ou les permissions ne sont pas trouvées.
   */
  async addPermissionsToUser(userId: number, permissionIds: number[]): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['permissions', 'role', 'role.permissions'] });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    const permissionsToAdd = await this.userRepository.manager.getRepository(PermissionEntity).findByIds(permissionIds);
    const permissionMap = new Map(user.permissions.map(p => [p.id, p]));
    for (const perm of permissionsToAdd) {
      permissionMap.set(perm.id, perm);
    }
    user.permissions = Array.from(permissionMap.values());
    return this.userRepository.save(user);
  }

  /**
   * Supprime des permissions d'un utilisateur.
   * @param userId - L'identifiant de l'utilisateur.
   * @param permissionIds - Les identifiants des permissions à supprimer.
   * @returns L'utilisateur mis à jour sans les permissions supprimées.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   */
  async removePermissionsFromUser(userId: number, permissionIds: number[]): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['permissions', 'role', 'role.permissions'] });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    user.permissions = user.permissions.filter(p => !permissionIds.includes(p.id));
    return this.userRepository.save(user);
  }

  /**
   * Assigne un rôle à un utilisateur.
   * @param userId - L'identifiant de l'utilisateur.
   * @param roleId - L'identifiant du rôle à assigner.
   * @returns L'utilisateur mis à jour avec le nouveau rôle.
   * @throws NotFoundException si l'utilisateur ou le rôle n'est pas trouvé.
   */
  async setUserRole(userId: number, roleId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    const role = await this.userRepository.manager.getRepository(RoleEntity).findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Rôle non trouvé');
    user.role = role;
    return this.userRepository.save(user);
  }

  /**
   * Supprime le rôle d'un utilisateur.
   * @param userId - L'identifiant de l'utilisateur.
   * @returns L'utilisateur mis à jour sans rôle.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   */
  async removeUserRole(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    user.role = null;
    return this.userRepository.save(user);
  }

  /**
   * Récupère le profil complet de l'utilisateur courant.
   * @param userId - L'identifiant de l'utilisateur.
   * @returns Les données du profil utilisateur.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   */
  async getCurrentUserProfile(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'role.permissions', 'permissions'],
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }

  /**
   * Met à jour le profil de l'utilisateur courant.
   * @param userId - L'identifiant de l'utilisateur.
   * @param updateData - Les données à mettre à jour.
   * @returns L'utilisateur avec les données de profil mises à jour.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   */
  async updateCurrentUserProfile(userId: number, updateData: any): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    // On ne modifie que les champs autorisés
    if (updateData.fullName !== undefined) user.fullName = updateData.fullName;
    if (updateData.email !== undefined) user.email = updateData.email;
    if (updateData.description !== undefined) user.description = updateData.description;
    // Ajoute d'autres champs modifiables si besoin
    return this.userRepository.save(user);
  }

  /**
   * Télécharge une photo de profil pour l'utilisateur.
   * @param userId - L'identifiant de l'utilisateur.
   * @param file - Le fichier image à télécharger.
   * @returns L'utilisateur avec le chemin de la photo de profil mise à jour.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   */
  async uploadProfilePicture(userId: number, file: Express.Multer.File): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    const ext = path.extname(file.originalname);
    const fileName = `${userId}_${uuidv4()}${ext}`;
    const uploadPath = path.join('uploads', 'profile-pictures', fileName);
    fs.writeFileSync(uploadPath, file.buffer);
    user.profilePicture = uploadPath.replace(/\\/g, '/'); // Pour compatibilité Windows/Linux
    return this.userRepository.save(user);
  }

  /**
   * Récupère tous les utilisateurs avec pagination.
   * Si adminMode est true, retourne tous les utilisateurs (visibles ou non).
   * @param options - Les options de pagination.
   * @param adminMode - Si true, inclut les utilisateurs non visibles (admin only)
   * @returns Une page d'utilisateurs avec les relations nécessaires.
   */
  async findAllPaginated(options: IPaginationOptions, adminMode = false): Promise<Pagination<UserEntity>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'role_permissions')
      .leftJoinAndSelect('user.permissions', 'permissions');
    if (!adminMode) {
      queryBuilder.where('user.isVisible = :isVisible', { isVisible: true });
    }
    return paginate<UserEntity>(queryBuilder, options);
  }

  /**
   * Crée un utilisateur en tant qu'administrateur.
   * @param dto - Les données de l'utilisateur à créer.
   * @returns L'utilisateur créé.
   * @throws Error si l'e-mail est déjà utilisé.
   */
  async adminCreateUser(dto: any): Promise<UserEntity> {
    const existing = await this.findByEmail(dto.email).catch(() => null);
    if (existing) throw new Error('Email déjà utilisé');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    let city = undefined;
    if (dto.cityId) {
      city = await this.cityRepository.findOne({ where: { id: dto.cityId } });
      if (!city) throw new NotFoundException('City not found');
    }
    let role = undefined;
    if (dto.roleId) {
      role = await this.roleRepository.findOne({ where: { id: dto.roleId } });
      if (!role) throw new NotFoundException('Role not found');
    }
    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      description: dto.description,
      city,
      role,
      isActive: true,
      isVisible: dto.isVisible !== undefined ? dto.isVisible : true,
    });
    return this.userRepository.save(user);
  }

  /**
   * Met à jour un utilisateur en tant qu'administrateur.
   * @param userId - L'identifiant de l'utilisateur à mettre à jour.
   * @param dto - Les nouvelles données de l'utilisateur.
   * @returns L'utilisateur mis à jour.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   */
  async adminUpdateUser(userId: number, dto: any): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.description !== undefined) user.description = dto.description;
    if (dto.cityId !== undefined) {
      const city = await this.cityRepository.findOne({ where: { id: dto.cityId } });
      if (!city) throw new NotFoundException('City not found');
      user.city = city;
    }
    if (dto.roleId !== undefined) {
      const role = await this.roleRepository.findOne({ where: { id: dto.roleId } });
      if (!role) throw new NotFoundException('Role not found');
      user.role = role;
    }
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    if (dto.isVisible !== undefined) user.isVisible = dto.isVisible;
    return this.userRepository.save(user);
  }

  /**
   * Met à jour le fcmToken d'un utilisateur.
   * @param userId - L'identifiant de l'utilisateur.
   * @param fcmToken - Le nouveau fcmToken à enregistrer.
   * @returns L'utilisateur avec le fcmToken mis à jour.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   */
  async updateFcmToken(userId: number, fcmToken: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    user.fcmToken = fcmToken;
    return this.userRepository.save(user);
  }

  /**
   * Recherche des utilisateurs par description avec pagination.
   * @param keyword - Le mot-clé à rechercher dans la description.
   * @param page - Le numéro de la page à récupérer.
   * @param limit - Le nombre d'utilisateurs par page.
   * @returns Une page d'utilisateurs correspondant à la recherche.
   */
  async searchByDescription(keyword: string, page = 1, limit = 10): Promise<Pagination<UserEntity>> {
    const options: IPaginationOptions = { page, limit };
    const qb = this.userRepository.createQueryBuilder('user')
      .where('user.isVisible = true');
    if (keyword) {
      qb.andWhere('LOWER(user.description) LIKE :kw', { kw: `%${keyword.toLowerCase()}%` });
    }
    qb.orderBy('user.createdAt', 'DESC');
    return paginate<UserEntity>(qb, options);
  }

}
