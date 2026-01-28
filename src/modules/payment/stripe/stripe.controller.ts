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

    const { plan, interval } = body;

    let find_price = await getStripePrice(plan, interval);

    if (!find_price) {
      throw new NotFoundException(
        'Price not found for the given plan and interval',
      );
    }

    let users = await this.prisma.user.findUnique({
      where: { id: user },
    });

    if (!users.billing_id) {
      throw new NotFoundException('not create stripe account');
    }

    const customerId = users.billing_id;

    const amountInCents = Math.round(find_price * 100);

     
    

     

    

  }

  // Implement subscription creation logic here

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

      switch (event.type) {
        case 'payment_intent.succeeded':
          break;

        case 'payment_intent.payment_failed':
          break;

        case 'payment_intent.canceled':
          break;

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
