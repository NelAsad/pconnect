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
import { UserEntity } from './entities/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Contrôleur utilisateur
// Expose les endpoints pour la gestion des utilisateurs : CRUD, OTP, profil, rôles, permissions, pagination, upload photo, etc.
// Utilise le service UserService pour la logique métier.
// -----------------------------------------------------------------------------
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Récupère un utilisateur par son identifiant
   * @param id Identifiant de l'utilisateur
   * @returns Données de l'utilisateur
   */
  @ApiOperation({ summary: "Récupérer un utilisateur par son identifiant" })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: "Données de l'utilisateur", type: UserEntity })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  /**
   * Valide un code OTP pour l'inscription ou la vérification d'email
   * @param dto Données contenant l'email et l'OTP
   * @returns Résultat de la validation
   */
  @ApiOperation({ summary: 'Valider un code OTP' })
  @ApiBody({ type: ValidateOtpDto })
  @ApiResponse({ status: 200, description: 'OTP validé' })
  @Post('validate-otp')
  async validateOtp(@Body() dto: ValidateOtpDto) {
    return this.userService.validateOtp(dto.email, dto.otp);
  }

  /**
   * Renvoie un OTP à l'utilisateur (limité à un OTP actif)
   * @param dto Données contenant l'email
   * @returns Résultat de l'envoi
   */
  @ApiOperation({ summary: 'Renvoyer un OTP à un utilisateur' })
  @ApiBody({ type: ResendOtpDto })
  @ApiResponse({ status: 200, description: 'OTP renvoyé' })
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
  @ApiOperation({ summary: "Ajouter des permissions à un utilisateur" })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UserPermissionsDto })
  @ApiResponse({ status: 200, description: "Utilisateur mis à jour" })
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
  @ApiOperation({ summary: "Retirer des permissions à un utilisateur" })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UserPermissionsDto })
  @ApiResponse({ status: 200, description: "Utilisateur mis à jour" })
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
  @ApiOperation({ summary: "Attribuer un rôle à un utilisateur" })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UserRoleDto })
  @ApiResponse({ status: 200, description: "Utilisateur mis à jour" })
  @Post(':id/role')
  setUserRole(@Param('id') id: string, @Body() dto: UserRoleDto) {
    return this.userService.setUserRole(Number(id), dto.roleId);
  }

  /**
   * Retire le rôle d'un utilisateur
   * @param id Identifiant de l'utilisateur
   * @returns Utilisateur mis à jour
   */
  @ApiOperation({ summary: "Retirer le rôle d'un utilisateur" })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: "Utilisateur mis à jour" })
  @Delete(':id/role')
  removeUserRole(@Param('id') id: string) {
    return this.userService.removeUserRole(Number(id));
  }

  /**
   * Récupère le profil de l'utilisateur courant (JWT requis)
   * @param user Utilisateur courant injecté par le décorateur
   * @returns Données du profil utilisateur
   */
  @ApiOperation({ summary: "Récupérer le profil de l'utilisateur courant" })
  @ApiResponse({ status: 200, description: "Données du profil utilisateur", type: UserEntity })
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
  @ApiOperation({ summary: "Mettre à jour le profil de l'utilisateur courant" })
  @ApiResponse({ status: 200, description: "Profil mis à jour", type: UserEntity })
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
  @ApiOperation({ summary: "Uploader une photo de profil" })
  @ApiResponse({ status: 200, description: "Chemin de la photo de profil" })
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
  @ApiOperation({ summary: "Modifier la visibilité du profil utilisateur courant" })
  @ApiResponse({ status: 200, description: "Utilisateur mis à jour" })
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
  @ApiOperation({ summary: "Activer un utilisateur" })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: "Utilisateur activé" })
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
  @ApiOperation({ summary: "Désactiver un utilisateur" })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: "Utilisateur désactivé" })
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
  @ApiOperation({ summary: "Liste paginée des utilisateurs" })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: "Liste paginée des utilisateurs" })
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
  @ApiOperation({ summary: "Créer un utilisateur" })
  @ApiBody({ type: AdminCreateUserDto })
  @ApiResponse({ status: 201, description: "Utilisateur créé" })
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
  @ApiOperation({ summary: "Mettre à jour un utilisateur" })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: AdminUpdateUserDto })
  @ApiResponse({ status: 200, description: "Utilisateur mis à jour" })
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
  @ApiOperation({ summary: "Modifier la visibilité d'un utilisateur" })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: "Utilisateur mis à jour" })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user:update')
  @Patch(':id/visibility')
  async adminSetVisibility(@Param('id') id: string, @Body('isVisible') isVisible: boolean) {
    return this.userService.update(Number(id), { isVisible });
  }

  /**
   * Met à jour le fcmToken d'un utilisateur
   */
  @ApiOperation({ summary: "Mettre à jour le fcmToken d'un utilisateur" })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: "FCM Token mis à jour" })
  @Patch(':id/fcm-token')
  async updateFcmToken(@Param('id') id: string, @Body('fcmToken') fcmToken: string) {
    return this.userService.updateFcmToken(Number(id), fcmToken);
  }

  /**
   * Recherche d'utilisateurs par description (public)
   * @param keyword Mot-clé à rechercher dans la description
   * @param page Numéro de page
   * @param limit Nombre d'éléments par page (max 100)
   * @returns Liste paginée des utilisateurs correspondant à la recherche
   */
  @ApiOperation({ summary: "Rechercher des utilisateurs par description" })
  @ApiQuery({ name: 'keyword', type: String })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiResponse({ status: 200, description: "Liste paginée des utilisateurs" })
  @Get('search')
  async searchByDescription(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<Pagination<UserEntity>> {
    return this.userService.searchByDescription(keyword, Number(page), Number(limit));
  }
}
