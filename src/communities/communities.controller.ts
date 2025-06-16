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
import { InviteCommunityDto } from './dto/invite-community.dto';
import { CommunityInvitationEntity } from './entities/community-invitation.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('Communities')
@Controller('communities')
export class CommunitiesController {
    constructor(private readonly communitiesService: CommunitiesService) { }

    /**
     * Endpoint de création d'une communauté (statut PENDING, email envoyé au créateur)
     */
    @ApiOperation({ summary: 'Créer une nouvelle communauté' })
    @ApiBody({ type: CreateCommunityDto })
    @ApiResponse({ status: 201, description: 'Communauté créée', type: CommunityEntity })
    @UseGuards(JwtAuthGuard)
    @Post()
    async createCommunity(@Body() dto: CreateCommunityDto, @Req() req) {
        // req.user doit contenir l'utilisateur courant (grâce au JwtAuthGuard)
        return this.communitiesService.createCommunity(dto, req.user);
    }

    /**
     * Endpoint pour lister toutes les communautés avec pagination
     */
    @ApiOperation({ summary: 'Lister toutes les communautés paginées' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Liste paginée des communautés', type: Pagination })
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
     */
    @ApiOperation({ summary: 'Lister les membres d’une communauté paginée' })
    @ApiParam({ name: 'id', type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Liste paginée des membres', type: Pagination })
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
     */
    @ApiOperation({ summary: 'Valider une communauté' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Communauté validée', type: CommunityEntity })
    @Patch(':id/validate')
    async validateCommunity(@Param('id') id: string) {
        return this.communitiesService.validateCommunity(Number(id));
    }

    /**
     * Endpoint pour modifier une communauté
     */
    @ApiOperation({ summary: 'Mettre à jour une communauté' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: UpdateCommunityDto })
    @ApiResponse({ status: 200, description: 'Communauté mise à jour', type: CommunityEntity })
    @Patch(':id')
    async updateCommunity(@Param('id') id: string, @Body() dto: UpdateCommunityDto) {
        return this.communitiesService.updateCommunity(Number(id), dto);
    }

    /**
     * Liste paginée des communautés validées (statut VALIDATED)
     */
    @ApiOperation({ summary: 'Lister les communautés validées paginées' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Liste paginée des communautés validées', type: Pagination })
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
     */
    @ApiOperation({ summary: 'Récupérer une communauté par id' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Communauté trouvée', type: CommunityEntity })
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<CommunityEntity> {
        return this.communitiesService.findOneWithDetails(id);
    }

    /**
     * Rejette une communauté (statut REJECTED)
     */
    @ApiOperation({ summary: 'Rejeter une communauté' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Communauté rejetée', type: CommunityEntity })
    @Patch(':id/reject')
    async rejectCommunity(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<CommunityEntity> {
        return this.communitiesService.rejectCommunity(id);
    }

    /**
     * Suppression logique d'une communauté (soft delete)
     */
    @ApiOperation({ summary: 'Supprimer (soft delete) une communauté' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Communauté supprimée', type: CommunityEntity })
    @Delete(':id')
    async softDeleteCommunity(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<CommunityEntity> {
        return this.communitiesService.softDeleteCommunity(id);
    }

    /**
     * Permet à un utilisateur authentifié de soumettre sa candidature pour rejoindre une communauté.
     */
    @ApiOperation({ summary: 'Candidater à une communauté' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Candidature soumise' })
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
     */
    @ApiOperation({ summary: 'Accepter une candidature à une communauté' })
    @ApiParam({ name: 'applicationId', type: Number })
    @ApiResponse({ status: 200, description: 'Candidature acceptée', type: CommunityApplicationEntity })
    @Patch('applications/:applicationId/accept')
    async acceptCommunityApplication(
        @Param('applicationId', ParseIntPipe) applicationId: number,
    ): Promise<CommunityApplicationEntity> {
        return this.communitiesService.acceptCommunityApplication(applicationId);
    }

    /**
     * Rejette une demande d'adhésion à une communauté (refuse la candidature)
     */
    @ApiOperation({ summary: 'Rejeter une candidature à une communauté' })
    @ApiParam({ name: 'applicationId', type: Number })
    @ApiResponse({ status: 200, description: 'Candidature rejetée', type: CommunityApplicationEntity })
    @Patch('applications/:applicationId/reject')
    async rejectCommunityApplication(
        @Param('applicationId', ParseIntPipe) applicationId: number,
    ): Promise<CommunityApplicationEntity> {
        return this.communitiesService.rejectCommunityApplication(applicationId);
    }

    /**
     * Endpoint pour inviter un utilisateur à rejoindre une communauté (envoie un email avec un token)
     */
    @ApiOperation({ summary: 'Inviter un utilisateur à rejoindre une communauté' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: InviteCommunityDto })
    @ApiResponse({ status: 200, description: 'Invitation envoyée' })
    @Post(':id/invitations')
    @UseGuards(JwtAuthGuard)
    async inviteToCommunity(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: InviteCommunityDto,
        @CurrentUser() user: UserEntity,
    ): Promise<{ message: string }> {
        await this.communitiesService.inviteToCommunity(id, dto.email, user);
        return { message: 'Invitation envoyée avec succès.' };
    }

    /**
     * Endpoint pour accepter une invitation à une communauté via le token reçu par email
     */
    @ApiOperation({ summary: 'Accepter une invitation à une communauté' })
    @ApiParam({ name: 'token', type: String })
    @ApiResponse({ status: 200, description: 'Invitation acceptée' })
    @Post('invitations/:token/accept')
    @UseGuards(JwtAuthGuard)
    async acceptCommunityInvitation(
        @Param('token') token: string,
        @CurrentUser() user: UserEntity,
    ): Promise<{ message: string }> {
        await this.communitiesService.acceptCommunityInvitation(token, user);
        return { message: 'Vous avez rejoint la communauté avec succès.' };
    }
}
