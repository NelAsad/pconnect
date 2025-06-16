import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntity, ReportTargetType } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { AnnouncementEntity } from 'src/announcements/entities/announcement.entity';

/**
 * Service métier pour la gestion des signalements (reports).
 * Centralise la logique de création de signalement sur un utilisateur ou une annonce.
 * Utilise TypeORM pour l'accès à la base de données et la gestion des relations.
 */
@Injectable()
export class ReportService {
  /**
   * Injection des repositories TypeORM nécessaires (report, user, announcement).
   */
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AnnouncementEntity)
    private readonly announcementRepository: Repository<AnnouncementEntity>,
  ) {}

  /**
   * Crée un nouveau signalement en base.
   * Gère la validation de l'auteur et de la cible (utilisateur ou annonce).
   * @param dto Données du signalement à créer (voir CreateReportDto)
   * @throws Error si l'auteur ou la cible n'existe pas
   */
  async create(dto: CreateReportDto): Promise<ReportEntity> {
    const author = await this.userRepository.findOne({ where: { id: dto.authorId } });
    if (!author) throw new Error('Auteur non trouvé');

    let targetUser: UserEntity = null;
    let targetAnnouncement: AnnouncementEntity = null;
    if (dto.targetType === ReportTargetType.USER && dto.targetUserId) {
      targetUser = await this.userRepository.findOne({ where: { id: dto.targetUserId } });
      if (!targetUser) throw new Error('Utilisateur signalé non trouvé');
    }
    if (dto.targetType === ReportTargetType.ANNOUNCEMENT && dto.targetAnnouncementId) {
      targetAnnouncement = await this.announcementRepository.findOne({ where: { id: dto.targetAnnouncementId } });
      if (!targetAnnouncement) throw new Error('Annonce signalée non trouvée');
    }

    // Création et sauvegarde du signalement avec toutes les relations nécessaires
    const report = this.reportRepository.create({
      targetType: dto.targetType,
      targetUser,
      targetAnnouncement,
      author,
      reason: dto.reason,
      description: dto.description,
    });
    return this.reportRepository.save(report);
  }
}
