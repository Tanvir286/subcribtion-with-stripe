import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';

export async function handleExpiry(
  prisma: PrismaService,
  logger: Logger,
) {
  const now = new Date();

  /* ================= SUBSCRIPTIONS ================= */
  logger.log('Expired subscription check started');

  const expiredSubscriptions = await prisma.subscription.findMany({
    where: {
      current_period_end: { lt: now },
    },
    select: {
      id: true,
      user_id: true,
    },
  });

  if (expiredSubscriptions.length > 0) {
    await prisma.subscription.deleteMany({
      where: {
        id: { in: expiredSubscriptions.map((s) => s.id) },
      },
    });

    const userIds = expiredSubscriptions.map((s) => s.user_id).filter(Boolean);

    if (userIds.length > 0) {
      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { is_subscribed: false },
      });
    }

    logger.log('Expired subscriptions cleaned successfully');
  } else {
    logger.log('No expired subscriptions found');
  }

  /* ================= TRIALS ================= */
  logger.log('Expired trial check started');

  const expiredTrials = await prisma.freeTrial.findMany({
    where: {
      status: 'ACTIVE',
      current_period_end: { lt: now },
    },
    select: {
      id: true,
      user_id: true,
    },
  });

  if (expiredTrials.length > 0) {
    await prisma.freeTrial.updateMany({
      where: {
        id: { in: expiredTrials.map((t) => t.id) },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    const userIds = expiredTrials.map((t) => t.user_id).filter(Boolean);

    if (userIds.length > 0) {
      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: {
          is_trial: false,
          trials_used: true,
        },
      });
    }

    logger.log('Expired trials processed successfully');
  } else {
    logger.log('No expired trials found');
  }
}
