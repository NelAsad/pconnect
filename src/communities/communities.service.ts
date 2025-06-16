// -----------------------------------------------------------------------------
// Service Communities
// Centralise la logique métier liée aux communautés (création, gestion, membres, etc.)
// À compléter selon les besoins métier
// -----------------------------------------------------------------------------
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityEntity } from './entities/community.entity';
import { MailService } from 'src/common/mail/mail.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { CommunityStatus } from 'src/common/enums/community-status.enum';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CommunityApplicationEntity } from './entities/community-application.entity';
import { CommunityInvitationEntity, CommunityInvitationStatus } from './entities/community-invitation.entity';
import { InviteCommunityDto } from './dto/invite-community.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CommunitiesService {
    constructor(
        @InjectRepository(CommunityEntity)
        private communityRepository: Repository<CommunityEntity>,
        private userRepository: Repository<UserEntity>,
        private applicationRepository: Repository<CommunityApplicationEntity>,
        private mailService: MailService,
        private invitationRepository: Repository<CommunityInvitationEntity>,
    ) { }

    /**
     * Crée une communauté avec le statut PENDING et notifie le créateur par email
     * @param data Données de la communauté (name, description, etc.)
     * @param creator Utilisateur créateur
     * @returns La communauté créée
     */
    async createCommunity(data: Partial<CommunityEntity>, creator: UserEntity): Promise<CommunityEntity> {
        const community = this.communityRepository.create({
            ...data,
            status: CommunityStatus.PENDING,
            createdBy: creator,
        });
        const saved = await this.communityRepository.save(community);
        await this.mailService.sendCommunityPending(creator.email, saved.name, creator.fullName || creator.email);
        return saved;
    }

    /**
     * Liste paginée de toutes les communautés
     * @param options Options de pagination
     * @returns Page de communautés
     */
    async findAllPaginated(options: IPaginationOptions): Promise<Pagination<CommunityEntity>> {
        const queryBuilder = this.communityRepository.createQueryBuilder('community')
            .leftJoinAndSelect('community.createdBy', 'createdBy')
            .leftJoinAndSelect('community.city', 'city')
            .leftJoinAndSelect('community.country', 'country');
        return paginate<CommunityEntity>(queryBuilder, options);
    }

    /**
     * Liste paginée des membres d'une communauté
     * @param communityId ID de la communauté
     * @param options Options de pagination
     * @returns Page de membres (utilisateurs)
     */
    async findMembersPaginated(communityId: number, options: IPaginationOptions): Promise<Pagination<UserEntity>> {
        const community = await this.communityRepository.findOne({
            where: { id: communityId },
            relations: ['members'],
        });
        if (!community) throw new Error('Communauté non trouvée');
        // Pagination manuelle sur le tableau des membres
        const page = Number(options.page) || 1;
        const limit = Number(options.limit) || 10;
        const start = (page - 1) * limit;
        const end = start + limit;
        const items = community.members.slice(start, end);
        return {
            items,
            meta: {
                itemCount: items.length,
                totalItems: community.members.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(community.members.length / limit),
                currentPage: page,
            },
            links: {},
        };
    }

    /**
     * Valide une communauté (change son statut à VALIDATED)
     * @param id ID de la communauté
     * @returns La communauté validée
     */
    async validateCommunity(id: number): Promise<CommunityEntity> {
        const community = await this.communityRepository.findOne({ where: { id } });
        if (!community) throw new Error('Communauté non trouvée');
        community.status = CommunityStatus.VALIDATED;
        return this.communityRepository.save(community);
    }

    /**
     * Met à jour une communauté
     * @param id ID de la communauté
     * @param data Données à mettre à jour
     * @returns La communauté mise à jour
     */
    async updateCommunity(id: number, data: Partial<CommunityEntity>): Promise<CommunityEntity> {
        const community = await this.communityRepository.findOne({ where: { id } });
        if (!community) throw new Error('Communauté non trouvée');
        Object.assign(community, data);
        return this.communityRepository.save(community);
    }

    /**
     * Pagination des communautés par statut
     * @param status statut recherché (ex: VALIDATED)
     * @param options options de pagination
     */
    async paginateByStatus(
        status: CommunityStatus,
        options: IPaginationOptions,
    ): Promise<Pagination<CommunityEntity>> {
        const queryBuilder = this.communityRepository.createQueryBuilder('community');
        queryBuilder.where('community.status = :status', { status });
        queryBuilder.orderBy('community.createdAt', 'DESC');
        return paginate<CommunityEntity>(queryBuilder, options);
    }

    /**
   * Récupère une communauté avec toutes ses relations (créateur, membres, ville, pays)
   * @param id identifiant de la communauté
   */
    async findOneWithDetails(id: number): Promise<CommunityEntity> {
        const community = await this.communityRepository.findOne({
            where: { id },
            relations: [
                'createdBy',
                'members',
                'city',
                'country',
            ],
        });
        if (!community) {
            throw new NotFoundException('Community not found');
        }
        return community;
    }

    /**
   * Rejette une communauté (passe le statut à REJECTED)
   * @param id identifiant de la communauté
   */
    async rejectCommunity(id: number): Promise<CommunityEntity> {
        const community = await this.communityRepository.findOne({ where: { id } });
        if (!community) {
            throw new NotFoundException('Community not found');
        }
        community.status = CommunityStatus.REJECTED;
        return this.communityRepository.save(community);
    }

    /**
   * Suppression logique d'une communauté (soft delete)
   * @param id identifiant de la communauté
   */
    async softDeleteCommunity(id: number): Promise<CommunityEntity> {
        const community = await this.communityRepository.findOne({ where: { id } });
        if (!community) {
            throw new NotFoundException('Community not found');
        }
        await this.communityRepository.softRemove(community);
        return { ...community, id }; // retourne l'entité supprimée logiquement
    }

    /**
   * Permet à un utilisateur de soumettre sa candidature pour rejoindre une communauté.
   * @param communityId identifiant de la communauté
   * @param userId identifiant de l'utilisateur
   */
    async applyToCommunity(communityId: number, userId: number): Promise<void> {
        const community = await this.communityRepository.findOne({
            where: { id: communityId },
            relations: ['members'],
        });
        if (!community) throw new NotFoundException('Community not found');

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        // Vérifie si l'utilisateur est déjà membre
        if (community.members.some(member => member.id === user.id)) {
            throw new BadRequestException('Vous êtes déjà membre de cette communauté.');
        }

        // Vérifie si une candidature existe déjà
        const existingApplication = await this.applicationRepository.findOne({
            where: { community: { id: communityId }, user: { id: userId } },
        });
        if (existingApplication) {
            throw new BadRequestException('Vous avez déjà soumis une candidature pour cette communauté.');
        }

        // Enregistre la candidature
        const application = this.applicationRepository.create({
            community,
            user,
            status: 'PENDING', // à adapter selon ton enum/statut
            createdAt: new Date(),
        });
        await this.applicationRepository.save(application);

        // Envoie un mail à l'utilisateur
        await this.mailService.sendUserCommunityPending(user.email, community.name, user.fullName || user.email);

    }

    /**
   * Accepte une demande d'adhésion à une communauté
   * @param applicationId identifiant de la candidature
   */
    async acceptCommunityApplication(applicationId: number): Promise<CommunityApplicationEntity> {
        const application = await this.applicationRepository.findOne({
            where: { id: applicationId },
            relations: ['community', 'user'],
        });
        if (!application) throw new NotFoundException('Candidature non trouvée');
        if (application.status === 'ACCEPTED') {
            throw new BadRequestException('Cette candidature a déjà été acceptée.');
        }

        // Ajoute l'utilisateur aux membres de la communauté
        const community = await this.communityRepository.findOne({
            where: { id: application.community.id },
            relations: ['members'],
        });
        if (!community) throw new NotFoundException('Communauté non trouvée');

        // Vérifie si l'utilisateur est déjà membre
        if (!community.members.some(member => member.id === application.user.id)) {
            community.members.push(application.user);
            await this.communityRepository.save(community);
        }

        // Met à jour le statut de la candidature
        application.status = 'ACCEPTED';
        const savedApplication = await this.applicationRepository.save(application);

        // Envoie un mail à l'utilisateur
        await this.mailService.sendUserCommunityAccepted(application.user.email, application.community.name, application.user.fullName || application.user.email);

        return savedApplication;
    }


    /**
   * Refuse une demande d'adhésion à une communauté et envoie un mail à l'utilisateur
   * @param applicationId identifiant de la candidature
   */
    async rejectCommunityApplication(applicationId: number): Promise<CommunityApplicationEntity> {
        const application = await this.applicationRepository.findOne({
            where: { id: applicationId },
            relations: ['community', 'user'],
        });
        if (!application) throw new NotFoundException('Candidature non trouvée');
        if (application.status === 'REJECTED') {
            throw new BadRequestException('Cette candidature a déjà été rejetée.');
        }

        application.status = 'REJECTED';
        const savedApplication = await this.applicationRepository.save(application);

        // Envoie un mail à l'utilisateur
        await this.mailService.sendUserCommunityRejected(application.user.email, application.community.name, application.user.fullName || application.user.email);

        return savedApplication;
    }

    /**
     * Invite un utilisateur à rejoindre une communauté (génère un token, envoie un email)
     */
    async inviteToCommunity(communityId: number, email: string, invitedBy: UserEntity): Promise<void> {
        const community = await this.communityRepository.findOne({ where: { id: communityId }, relations: ['members'] });
        if (!community) throw new NotFoundException('Communauté non trouvée');

        // Vérifie si l'email appartient déjà à un membre
        const isAlreadyMember = community.members.some(m => m.email === email);
        if (isAlreadyMember) throw new BadRequestException('Cet utilisateur est déjà membre de la communauté.');

        // Génère un token unique
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); // 3 jours

        // Crée et sauvegarde l'invitation
        const invitation = this.invitationRepository.create({
            email,
            token,
            status: CommunityInvitationStatus.PENDING,
            community,
            invitedBy,
            expiresAt,
        });
        await this.invitationRepository.save(invitation);

        // Envoie l'email d'invitation
        await this.mailService.sendCommunityInvitation(email, community.name, token);
    }

    /**
     * Accepte une invitation à une communauté via le token
     */
    async acceptCommunityInvitation(token: string, user: UserEntity): Promise<void> {
        const invitation = await this.invitationRepository.findOne({ where: { token }, relations: ['community'] });
        if (!invitation) throw new NotFoundException('Invitation non trouvée');
        if (invitation.status !== CommunityInvitationStatus.PENDING) throw new BadRequestException('Invitation déjà utilisée ou expirée.');
        if (invitation.expiresAt && invitation.expiresAt < new Date()) {
            invitation.status = CommunityInvitationStatus.EXPIRED;
            await this.invitationRepository.save(invitation);
            throw new BadRequestException('Invitation expirée.');
        }

        // Ajoute l'utilisateur aux membres de la communauté
        const community = await this.communityRepository.findOne({ where: { id: invitation.community.id }, relations: ['members'] });
        if (!community) throw new NotFoundException('Communauté non trouvée');
        if (!community.members.some(m => m.id === user.id)) {
            community.members.push(user);
            await this.communityRepository.save(community);
        }

        // Met à jour le statut de l'invitation
        invitation.status = CommunityInvitationStatus.ACCEPTED;
        await this.invitationRepository.save(invitation);
    }

}
