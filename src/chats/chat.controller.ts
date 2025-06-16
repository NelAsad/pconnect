import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageEntity } from './entities/message.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

/**
 * Contrôleur REST pour la gestion de la messagerie privée (messages).
 * Fournit les endpoints CRUD, pagination, et récupération des conversations entre utilisateurs.
 * Toutes les routes sont sécurisées côté service (vérification des droits à ajouter selon besoin).
 */
@Controller('chats/messages')
export class ChatController {
  /**
   * Injection du service métier de chat.
   */
  constructor(private readonly chatService: ChatService) {}

  /**
   * Création d'un nouveau message privé (avec pièces jointes éventuelles).
   * @param data Données du message à créer
   */
  @Post()
  async create(
    @Body() data: Partial<MessageEntity>
  ): Promise<MessageEntity> {
    return this.chatService.create(data);
  }

  /**
   * Récupère tous les messages (non paginés).
   */
  @Get()
  async findAll(): Promise<MessageEntity[]> {
    return this.chatService.findAll();
  }

  /**
   * Récupère les messages paginés (avec paramètres page/limit).
   */
  @Get('messages/paginated')
  async findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<Pagination<MessageEntity>> {
    return this.chatService.findAllPaginated(Number(page), Number(limit));
  }

  /**
   * Récupère un message par son id.
   * @param id Identifiant du message
   */
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MessageEntity> {
    return this.chatService.findOne(Number(id));
  }

  /**
   * Met à jour un message existant.
   * @param id Identifiant du message
   * @param data Données à mettre à jour
   */
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<MessageEntity>): Promise<MessageEntity> {
    return this.chatService.update(Number(id), data);
  }

  /**
   * Supprime un message (suppression définitive, pas soft delete).
   * @param id Identifiant du message
   */
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.chatService.remove(Number(id));
  }

  /**
   * Récupère la conversation paginée entre deux utilisateurs (userA, userB).
   * @param userA Id utilisateur A
   * @param userB Id utilisateur B
   * @param page Page de pagination
   * @param limit Nombre d'éléments par page
   */
  @Get('messages/conversation')
  async findConversationPaginated(
    @Query('userA') userA: number,
    @Query('userB') userB: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.chatService.findConversationPaginated(Number(userA), Number(userB), Number(page), Number(limit));
  }
}
