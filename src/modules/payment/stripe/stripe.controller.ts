import {
  Controller,
  Post,
  Req,
  Headers,
  UseGuards,
  Body,
  Param,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request } from 'express';
import { TransactionRepository } from '../../../common/repository/transaction/transaction.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { StripePayment } from 'src/common/lib/Payment/stripe/StripePayment';
import { Stripe } from 'stripe';
import { getStripePrice } from 'src/common/repository/StripeBalanceInfo/stripe.repository';
import { find } from 'rxjs';
import { isThisMinute } from 'date-fns';

@Controller('payment/stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  // =====================================================================
  // ========================== PAYMENT CREATE ============================
  // =====================================================================

  @Post('subscription')
  @UseGuards(JwtAuthGuard)
  async createSubscription(@Body() body: any, @Req() req: any) {
    const user = req.user.userId;
    let metadata: any = {};

    let { plan, interval } = body;

    plan = String(plan).toUpperCase();
    interval = String(interval).toUpperCase();

    const find_price = await getStripePrice(plan, interval);

    if (!find_price) {
      throw new NotFoundException(
        'Price not found for the given plan and interval',
      );
    }

    let users = await this.prisma.user.findUnique({
      where: { id: user },
    });

    // if (users.is_subscribed) {
    //   throw new ForbiddenException('User is  subscribed');
    // }

    let customerId = users.billing_id;

    if (!customerId) {
      const customer = await StripePayment.createCustomer({
        user_id: user,
        name: users.name ?? '',
        email: users.email ?? '',
      });

      customerId = customer.id;

      await this.prisma.user.update({
        where: { id: user },
        data: { billing_id: customerId },
      });
    }

    const amountInCents = Math.round(Number(find_price) * 100);

    const periodStart = new Date();
    const periodEnd = this.addInterval(periodStart, interval);

    const subscription = await this.prisma.subscription.create({
      data: {
        user_id: user,
        stripe_price: find_price.toString(),
        plan: plan,
        interval: interval,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        status: 'INACTIVE',
      },
    });

    metadata = {
      userId: user,
      subscriptionId: subscription.id,
      plan,
      interval,
    };

    const paymentIntent = await StripePayment.createPaymentIntent({
      amount: amountInCents,
      currency: 'usd',
      customer_id: customerId,
      payment_method_types: ['card'],
      metadata: metadata,
    });

    console.log('Payment Intent Created:', paymentIntent.id);

    return {
      success: true,
      message: 'Payment intent created successfully',
      client_secret: paymentIntent.client_secret,
      subscription_id: subscription.id,
    };
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
  ) {
    try {
      const payload = req.rawBody.toString();
      const event = await this.stripeService.handleWebhook(payload, signature);

      if (!event.data || !event.data.object) return { received: true };

      const pi = event.data.object as Stripe.PaymentIntent;
      const meta = pi.metadata || {};

      const subscriptionId = meta.subscriptionId;
      const userId = meta.userId;

      switch (event.type) {
        case 'payment_intent.succeeded': {
          if (!subscriptionId) break;
          if (!userId) break;

          const dbSubscription = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
          });

          if (!dbSubscription) break;

          const start = new Date();
          const end = this.addInterval(start, dbSubscription.interval);

          await this.prisma.$transaction(async (tx) => {
            await tx.subscription.update({
              where: { id: subscriptionId },
              data: {
                status: 'ACTIVE',
                current_period_start: start,
                current_period_end: end,
              },
            });

            await tx.user.update({
              where: { id: userId },
              data: { is_subscribed: true },
            });
          });

          break;
        }

        case 'payment_intent.payment_failed': {
          if (!subscriptionId) break;
          await this.prisma.subscription.updateMany({
            where: { id: subscriptionId },
            data: { status: 'INACTIVE' },
          });
          break;
        }

        case 'payment_intent.canceled': {
          if (!subscriptionId) break;
          await this.prisma.subscription.updateMany({
            where: { id: subscriptionId },
            data: { status: 'CANCELED' },
          });
          break;
        }

        case 'payment_intent.requires_action':
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error', error);
      return { received: false };
    }
  }

  // =====================================================================
  // ======================= UTILITY RESPONSE METHODS ===================
  // =====================================================================

  private addInterval(start: Date, interval: string): Date {
    const end = new Date(start);
    switch (interval) {
      case 'MONTHLY':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'SEMIANNUAL':
        end.setMonth(end.getMonth() + 6);
        break;
      case 'ANNUAL':
        end.setFullYear(end.getFullYear() + 1);
        break;
      default:
        end.setMonth(end.getMonth() + 1);
        break;
    }
    return end;
  }

  private fail(message: string) {
    return { success: false, message };
  }

  private error(err: any) {
    console.error('PAYMENT ERROR:', err);

    return {
      success: false,
      message: err?.message ?? 'Payment failed',
      details: err?.response ?? null,
    };
  }
}
