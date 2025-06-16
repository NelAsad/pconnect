import { Body, Controller, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportEntity } from './entities/report.entity';

/**
 * Contrôleur REST pour la gestion des signalements (reports).
 * Permet de créer un signalement sur un utilisateur ou une annonce.
 * Les routes sont sécurisées côté service (vérification des droits à ajouter selon besoin).
 */
@Controller('reports')
export class ReportController {
  /**
   * Injection du service métier des signalements.
   */
  constructor(private readonly reportService: ReportService) {}

  /**
   * Création d'un nouveau signalement (POST /reports).
   * @param dto Données du signalement à créer (voir CreateReportDto)
   */
  @Post()
  async create(@Body() dto: CreateReportDto): Promise<ReportEntity> {
    return this.reportService.create(dto);
  }
}
