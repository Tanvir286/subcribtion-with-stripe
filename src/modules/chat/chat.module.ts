import { Module } from '@nestjs/common';
import { ConversationModule } from './conversation/conversation.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [ConversationModule, UserModule, MessageModule],
})
export class ChatModule {}
