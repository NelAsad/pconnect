import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { AnnouncementEntity } from 'src/announcements/entities/announcement.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Entité représentant une catégorie d'annonces.
 * Permet de regrouper les annonces par thématique, avec gestion de l'activation et du slug SEO.
 * Utilisé pour la navigation, le filtrage et la structuration du contenu sur la plateforme.
 */
@Entity('categories')
export class CategoryEntity {
  /**
   * Identifiant unique de la catégorie (clé primaire).
   */
  @ApiProperty({ description: 'Identifiant unique de la catégorie', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nom de la catégorie (obligatoire).
   */
  @ApiProperty({ description: 'Nom de la catégorie', example: 'Informatique' })
  @Column()
  name: string;

  /**
   * Slug unique pour l'URL (généré automatiquement à partir du nom).
   */
  @ApiPropertyOptional({ description: 'Slug unique pour l’URL', example: 'informatique' })
  @Column({ nullable: true, unique: true })
  slug?: string;

  /**
   * Description de la catégorie (optionnelle).
   */
  @ApiPropertyOptional({ description: 'Description de la catégorie', example: 'Services et produits informatiques.' })
  @Column({ nullable: true })
  description?: string;

  /**
   * Statut d'activation de la catégorie (true = active, false = désactivée).
   */
  @ApiProperty({ description: 'Statut d’activation de la catégorie', example: true })
  @Column({ default: true })
  isActive: boolean;

  /**
   * Date de création de la catégorie (auto-générée).
   */
  @ApiProperty({ description: 'Date de création', example: '2025-06-16T12:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Date de dernière modification de la catégorie (auto-générée).
   */
  @ApiProperty({ description: 'Date de dernière modification', example: '2025-06-16T12:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Liste des annonces associées à la catégorie (relation 1:N).
   */
  @ApiPropertyOptional({ description: 'Liste des annonces associées', type: () => [AnnouncementEntity] })
  @OneToMany(() => AnnouncementEntity, announcement => announcement.category)
  announcements: AnnouncementEntity[];

  /**
   * Génère automatiquement le slug à partir du nom avant insertion ou mise à jour.
   * Permet d'assurer l'unicité et la cohérence des URLs.
   */
  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = this.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');
    }
  }
}
