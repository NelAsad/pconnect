import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MessageEntity } from './entities/message.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { FirebaseService } from './firebase.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, UserEntity])],
  controllers: [ChatController],
  providers: [ChatService, FirebaseService, ChatGateway],
})
export class ChatModule {}
