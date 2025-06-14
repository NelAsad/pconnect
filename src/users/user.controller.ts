// src/users/user.controller.ts
import { Controller, Get, Param, Post, Body, Patch, Delete, UseGuards, UseInterceptors, UploadedFile, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { UserPermissionsDto } from './dto/user-permissions.dto';
import { UserRoleDto } from './dto/user-role.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

// -----------------------------------------------------------------------------
// Contrôleur utilisateur
// Expose les endpoints pour la gestion des utilisateurs : CRUD, OTP, profil, rôles, permissions, pagination, upload photo, etc.
// Utilise le service UserService pour la logique métier.
// -----------------------------------------------------------------------------
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Récupère un utilisateur par son identifiant
   * @param id Identifiant de l'utilisateur
   * @returns Données de l'utilisateur
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  /**
   * Valide un code OTP pour l'inscription ou la vérification d'email
   * @param dto Données contenant l'email et l'OTP
   * @returns Résultat de la validation
   */
  @Post('validate-otp')
  async validateOtp(@Body() dto: ValidateOtpDto) {
    return this.userService.validateOtp(dto.email, dto.otp);
  }

  /**
   * Renvoie un OTP à l'utilisateur (limité à un OTP actif)
   * @param dto Données contenant l'email
   * @returns Résultat de l'envoi
   */
  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto) {
    return this.userService.resendOtp(dto.email);
  }
  
  /**
   * Ajoute des permissions à un utilisateur
   * @param id Identifiant de l'utilisateur
   * @param dto Liste des permissions à ajouter
   * @returns Utilisateur mis à jour
   */
  @Post(':id/permissions')
  addPermissionsToUser(@Param('id') id: string, @Body() dto: UserPermissionsDto) {
    return this.userService.addPermissionsToUser(Number(id), dto.permissionIds);
  }

  /**
   * Retire des permissions à un utilisateur
   * @param id Identifiant de l'utilisateur
   * @param dto Liste des permissions à retirer
   * @returns Utilisateur mis à jour
   */
  @Delete(':id/permissions')
  removePermissionsFromUser(@Param('id') id: string, @Body() dto: UserPermissionsDto) {
    return this.userService.removePermissionsFromUser(Number(id), dto.permissionIds);
  }

  /**
   * Attribue un rôle à un utilisateur
   * @param id Identifiant de l'utilisateur
   * @param dto Identifiant du rôle à attribuer
   * @returns Utilisateur mis à jour
   */
  @Post(':id/role')
  setUserRole(@Param('id') id: string, @Body() dto: UserRoleDto) {
    return this.userService.setUserRole(Number(id), dto.roleId);
  }

  /**
   * Retire le rôle d'un utilisateur
   * @param id Identifiant de l'utilisateur
   * @returns Utilisateur mis à jour
   */
  @Delete(':id/role')
  removeUserRole(@Param('id') id: string) {
    return this.userService.removeUserRole(Number(id));
  }

  /**
   * Récupère le profil de l'utilisateur courant (JWT requis)
   * @param user Utilisateur courant injecté par le décorateur
   * @returns Données du profil utilisateur
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user) {
    return this.userService.getCurrentUserProfile(user.id);
  }

  /**
   * Met à jour le profil de l'utilisateur courant (JWT requis)
   * @param user Utilisateur courant
   * @param dto Données à mettre à jour
   * @returns Profil mis à jour
   */
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@CurrentUser() user, @Body() dto: UpdateProfileDto) {
    return this.userService.updateCurrentUserProfile(user.id, dto);
  }

  /**
   * Upload une photo de profil pour l'utilisateur courant (JWT requis)
   * @param user Utilisateur courant
   * @param file Fichier image uploadé
   * @returns Chemin de la photo de profil
   */
  @UseGuards(JwtAuthGuard)
  @Patch('me/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(@CurrentUser() user, @UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadProfilePicture(user.id, file);
  }

  /**
   * Modifie la visibilité du profil utilisateur courant (JWT requis)
   * @param user Utilisateur courant
   * @param isVisible Nouvelle valeur de visibilité
   * @returns Utilisateur mis à jour
   */
  @UseGuards(JwtAuthGuard)
  @Patch('me/visibility')
  async setVisibility(@CurrentUser() user, @Body('isVisible') isVisible: boolean) {
    return this.userService.update(user.id, { isVisible });
  }

  /**
   * Active un utilisateur (admin, permission requise)
   * @param id Identifiant de l'utilisateur
   * @returns Utilisateur activé
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:activate')
  @Patch(':id/activate')
  activateUser(@Param('id') id: string) {
    return this.userService.update(Number(id), { isActive: true });
  }

  /**
   * Désactive un utilisateur (admin, permission requise)
   * @param id Identifiant de l'utilisateur
   * @returns Utilisateur désactivé
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:deactivate')
  @Patch(':id/deactivate')
  deactivateUser(@Param('id') id: string) {
    return this.userService.update(Number(id), { isActive: false });
  }

  /**
   * Liste paginée des utilisateurs (admin, permission requise)
   * @param page Numéro de page
   * @param limit Nombre d'éléments par page (max 100)
   * @returns Liste paginée des utilisateurs (tous, même non visibles pour l'admin)
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:list')
  @Get()
  async findAllPaginated(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    limit = Math.min(limit, 100);
    // Pour l'admin, on veut tout, même les non visibles
    return this.userService.findAllPaginated({ page, limit }, true);
  }

  /**
   * Création d'un utilisateur par un administrateur (permission requise)
   * @param dto Données du nouvel utilisateur
   * @returns Utilisateur créé
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:create')
  @Post()
  async adminCreateUser(@Body() dto: AdminCreateUserDto) {
    return this.userService.adminCreateUser(dto);
  }

  /**
   * Mise à jour d'un utilisateur par un administrateur (permission requise)
   * @param id Identifiant de l'utilisateur
   * @param dto Données à mettre à jour
   * @returns Utilisateur mis à jour
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:update')
  @Patch(':id')
  async adminUpdateUser(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.userService.adminUpdateUser(Number(id), dto);
  }

  /**
   * Modifie la visibilité d'un utilisateur (admin, permission requise)
   * @param id Identifiant de l'utilisateur
   * @param isVisible Nouvelle valeur de visibilité
   * @returns Utilisateur mis à jour
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:update')
  @Patch(':id/visibility')
  async adminSetVisibility(@Param('id') id: string, @Body('isVisible') isVisible: boolean) {
    return this.userService.update(Number(id), { isVisible });
  }
}
