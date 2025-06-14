// -----------------------------------------------------------------------------
// Contrôleur Communities
// Expose les endpoints pour la gestion des communautés (CRUD, membres, etc.)
// À compléter selon les besoins métier
// -----------------------------------------------------------------------------
import { Controller, Post, Body, Req, UseGuards, Get, Query, DefaultValuePipe, ParseIntPipe, Param, Patch, Delete } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CommunityEntity } from './entities/community.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CommunityStatus } from 'src/common/enums/community-status.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { CommunityApplicationEntity } from './entities/community-application.entity';

@Controller('communities')
export class CommunitiesController {
    constructor(private readonly communitiesService: CommunitiesService) { }

    /**
     * Endpoint de création d'une communauté (statut PENDING, email envoyé au créateur)
     * @param dto Données de la communauté à créer
     * @param req Requête contenant l'utilisateur courant (JWT)
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    async createCommunity(@Body() dto: CreateCommunityDto, @Req() req) {
        // req.user doit contenir l'utilisateur courant (grâce au JwtAuthGuard)
        return this.communitiesService.createCommunity(dto, req.user);
    }

    /**
     * Endpoint pour lister toutes les communautés avec pagination
     * @param page Numéro de page
     * @param limit Nombre d'éléments par page (max 100)
     * @returns Liste paginée des communautés
     */
    @Get()
    async findAllPaginated(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        limit = Math.min(limit, 100);
        return this.communitiesService.findAllPaginated({ page, limit });
    }

    /**
     * Endpoint pour lister les membres d'une communauté avec pagination
     * @param id ID de la communauté
     * @param page Numéro de page
     * @param limit Nombre d'éléments par page (max 100)
     * @returns Liste paginée des membres
     */
    @Get(':id/members')
    async findMembersPaginated(
        @Param('id') id: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        limit = Math.min(limit, 100);
        return this.communitiesService.findMembersPaginated(Number(id), { page, limit });
    }

    /**
     * Endpoint pour valider une communauté (changement de statut à VALIDATED)
     * @param id ID de la communauté
     * @returns La communauté validée
     */
    @Patch(':id/validate')
    async validateCommunity(@Param('id') id: string) {
        return this.communitiesService.validateCommunity(Number(id));
    }

    /**
     * Endpoint pour modifier une communauté
     * @param id ID de la communauté
     * @param dto Données à mettre à jour
     * @returns La communauté mise à jour
     */
    @Patch(':id')
    async updateCommunity(@Param('id') id: string, @Body() dto: UpdateCommunityDto) {
        return this.communitiesService.updateCommunity(Number(id), dto);
    }

    /**
     * Liste paginée des communautés validées (statut VALIDATED)
     * @param page numéro de page (défaut: 1)
     * @param limit nombre d'éléments par page (défaut: 10)
     */
    @Get('validated')
    async getValidatedCommunities(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ): Promise<Pagination<CommunityEntity>> {
        return this.communitiesService.paginateByStatus(
            CommunityStatus.VALIDATED,
            { page, limit },
        );
    }

    /**
   * Récupère une communauté par son id avec tous ses détails
   * @param id identifiant de la communauté
   */
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<CommunityEntity> {
        return this.communitiesService.findOneWithDetails(id);
    }

    /**
   * Rejette une communauté (statut REJECTED)
   * @param id identifiant de la communauté
   */
    @Patch(':id/reject')
    async rejectCommunity(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<CommunityEntity> {
        return this.communitiesService.rejectCommunity(id);
    }

    /**
   * Suppression logique d'une communauté (soft delete)
   * @param id identifiant de la communauté
   */
    @Delete(':id')
    async softDeleteCommunity(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<CommunityEntity> {
        return this.communitiesService.softDeleteCommunity(id);
    }

    /**
   * Permet à un utilisateur authentifié de soumettre sa candidature pour rejoindre une communauté.
   * @param id identifiant de la communauté
   * @param user utilisateur courant (extrait du JWT)
   */
    @Post(':id/apply')
    @UseGuards(JwtAuthGuard)
    async applyToCommunity(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: UserEntity,
    ): Promise<{ message: string }> {
        await this.communitiesService.applyToCommunity(id, user.id);
        return { message: 'Votre candidature a été soumise avec succès.' };
    }

    /**
   * Valide une demande d'adhésion à une communauté (accepte la candidature)
   * @param applicationId identifiant de la candidature
   */
    @Patch('applications/:applicationId/accept')
    async acceptCommunityApplication(
        @Param('applicationId', ParseIntPipe) applicationId: number,
    ): Promise<CommunityApplicationEntity> {
        return this.communitiesService.acceptCommunityApplication(applicationId);
    }

    /**
   * Rejette une demande d'adhésion à une communauté (refuse la candidature)
   * @param applicationId identifiant de la candidature
   */
    @Patch('applications/:applicationId/reject')
    async rejectCommunityApplication(
        @Param('applicationId', ParseIntPipe) applicationId: number,
    ): Promise<CommunityApplicationEntity> {
        return this.communitiesService.rejectCommunityApplication(applicationId);
    }

}
