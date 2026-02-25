import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrialDto } from './dto/create-trail.dto';

@Injectable()
export class TrailService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================Create Trail =========================
  async create(
    createTrialDto: CreateTrialDto,
    userId: string
  ) {
    const { plan, interval } = createTrialDto;

    const userinfo = await this.prisma.user.findUnique({
      where: { id: userId },
    });
 
    if(userinfo.trials_used) {
      return {
        success: false,
        message: 'User has already used the trial',
      };
    }

    if (userinfo.is_trial) {
      return {
        success: false,
        message: 'User has already run a trial',
      };
    }

    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(now.getDate() + 14); 

    const trial = await this.prisma.freeTrial.create({
      data: {
        user_id: userId,
        plan: plan,
        interval: interval, 
        status: 'ACTIVE',
        current_period_start: now,
        current_period_end: trialEnd,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { is_trial: true, is_subscribed: true },
    });

    return {
      success: true,
      message: 'Trial created successfully',
      data: trial,
    };
  }

  
}
