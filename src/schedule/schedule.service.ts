import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private prisma: PrismaService) {}

  // প্রতিদিন রাত ১২টায় চলবে
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  
  async handleExpiredSubscriptions() {
    this.logger.log('Expired subscription check started');

    const now = new Date();

    // 1️⃣ যেসব subscription এর সময় শেষ
    const expiredSubscriptions = await this.prisma.subscription.findMany({
      where: {
        current_period_end: {
          lt: now,
        },
      },
      select: {
        id: true,
        user_id: true,
      },
    });

    // যদি কিছু না পাওয়া যায়
    if (expiredSubscriptions.length === 0) {
      this.logger.log('No expired subscriptions found');
      return;
    }

    // 2️⃣ Subscription delete
    await this.prisma.subscription.deleteMany({
      where: {
        id: {
          in: expiredSubscriptions.map((s) => s.id),
        },
      },
    });

    // 3️⃣ User এর is_subscribed = false
    const userIds = expiredSubscriptions
      .map((s) => s.user_id)
      .filter(Boolean);

    if (userIds.length > 0) {
      await this.prisma.user.updateMany({
        where: {
          id: {
            in: userIds,
          },
        },
        data: {
          is_subscribed: false,
        },
      });
    }

    this.logger.log('Expired subscriptions cleaned successfully');
  }
}
