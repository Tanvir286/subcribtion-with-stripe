import { Module } from '@nestjs/common';
import { TrailService } from './trail.service';
import { TrailController } from './trail.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrailController],
  providers: [TrailService],
})
export class TrailModule {}
