import { Module } from '@nestjs/common';
import { SubscribtionService } from './subscribtion.service';
import { SubscribtionController } from './subscribtion.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule
  ],
  controllers: [SubscribtionController],
  providers: [SubscribtionService],
})
export class SubscribtionModule {}
