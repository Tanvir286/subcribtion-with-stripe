import { Controller, Post, Req, Headers, Body, UseGuards } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import { getStripePrice } from 'src/common/repository/StripeBalanceInfo/stripe.repository';
import { StripePayment } from 'src/common/lib/Payment/stripe/StripePayment';
import appConfig from 'src/config/app.config';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

const stripeClient = new Stripe(appConfig().payment.stripe.secret_key, {
  apiVersion: '2025-03-31.basil',
});

@Controller('payment/stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribe(@Req() req, @Body() body) {
    const user = req.user.userId;

    let { plan, interval } = body;

    plan = plan.toUpperCase();
    interval = interval.toUpperCase();

    const priceId = getStripePrice(plan, interval);
    
    if (!priceId) {
      throw new Error(`Invalid plan or interval: ${plan} - ${interval}`);
    }

    const userinfo = await this.prisma.user.findUnique({
      where: { id: user },
    });

    let customerId = userinfo.billing_id;

    if (!customerId) {
      // Create Stripe Customer
      const customer = await StripePayment.createCustomer({
        user_id: userinfo.id,
        email: userinfo.email,
        name: userinfo.name,
      });

      customerId = customer.id;
      // Update user with billing_id
      await this.prisma.user.update({
        where: { id: userinfo.id },
        data: { billing_id: customerId },
      });
    }

    const subscription = await stripeClient.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        user_id: user,
        plan,
        interval,
      },
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = (invoice as any)
      .payment_intent as Stripe.PaymentIntent;

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret,
      status: subscription.status,
    };
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
  ) {
    try {
      const payload = req.rawBody?.toString() ?? '';
      const event = await this.stripeService.handleWebhook(payload, signature);

      switch (event.type) {
        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as Stripe.Invoice;
          const subscriptionId = (invoice as any).subscription as string;

          const stripeSubscription: any =
            await stripeClient.subscriptions.retrieve(subscriptionId);

          const userId = stripeSubscription.metadata.user_id;

          await this.prisma.subscription.upsert({
            where: {
              stripe_subscription_id: stripeSubscription.id,
            },
            update: {
              status: stripeSubscription.status.toUpperCase() as any,
              current_period_start: new Date(
                stripeSubscription.current_period_start * 1000,
              ),
              current_period_end: new Date(
                stripeSubscription.current_period_end * 1000,
              ),
            },
            create: {
              stripe_subscription_id: stripeSubscription.id,
              stripe_customer_id: stripeSubscription.customer as string,
              stripe_price_id: stripeSubscription.items.data[0].price.id,
              plan: stripeSubscription.metadata.plan as any,
              interval: stripeSubscription.metadata.interval as any,
              status: stripeSubscription.status.toUpperCase() as any,
              current_period_start: new Date(
                stripeSubscription.current_period_start * 1000,
              ),
              current_period_end: new Date(
                stripeSubscription.current_period_end * 1000,
              ),
              user_id: userId,
            },
          });

          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;

          await this.prisma.subscription.update({
            where: {
              stripe_subscription_id: subscription.id,
            },
            data: {
              status: 'CANCELED',
              canceled_at: new Date(),
            },
          });
          break;
        }
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error', error);
      throw error;
    }
  }
}
