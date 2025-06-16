import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageEntity } from './entities/message.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

/**
 * Contrôleur REST pour la gestion de la messagerie privée (messages).
 * Fournit les endpoints CRUD, pagination, et récupération des conversations entre utilisateurs.
 * Toutes les routes sont sécurisées côté service (vérification des droits à ajouter selon besoin).
 */
@ApiTags('Chats')
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
  @ApiOperation({ summary: 'Créer un nouveau message privé' })
  @ApiBody({ type: MessageEntity })
  @ApiResponse({ status: 201, description: 'Message créé', type: MessageEntity })
  @Post()
  async create(
    @Body() data: Partial<MessageEntity>
  ): Promise<MessageEntity> {
    return this.chatService.create(data);
  }

  /**
   * Récupère tous les messages (non paginés).
   */
  @ApiOperation({ summary: 'Lister tous les messages (non paginés)' })
  @ApiResponse({ status: 200, description: 'Liste des messages', type: [MessageEntity] })
  @Get()
  async findAll(): Promise<MessageEntity[]> {
    return this.chatService.findAll();
  }

  /**
   * Récupère les messages paginés (avec paramètres page/limit).
   */
  @ApiOperation({ summary: 'Lister les messages paginés' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste paginée des messages', type: Pagination })
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
  @ApiOperation({ summary: 'Récupérer un message par id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Message trouvé', type: MessageEntity })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MessageEntity> {
    return this.chatService.findOne(Number(id));
  }

  /**
   * Met à jour un message existant.
   * @param id Identifiant du message
   * @param data Données à mettre à jour
   */
  @ApiOperation({ summary: 'Mettre à jour un message' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: MessageEntity })
  @ApiResponse({ status: 200, description: 'Message mis à jour', type: MessageEntity })
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<MessageEntity>): Promise<MessageEntity> {
    return this.chatService.update(Number(id), data);
  }

  /**
   * Supprime un message (suppression définitive, pas soft delete).
   * @param id Identifiant du message
   */
  @ApiOperation({ summary: 'Supprimer un message' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Message supprimé' })
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
  @ApiOperation({ summary: 'Récupérer la conversation paginée entre deux utilisateurs' })
  @ApiQuery({ name: 'userA', type: Number })
  @ApiQuery({ name: 'userB', type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Messages de la conversation paginée', type: Pagination })
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
