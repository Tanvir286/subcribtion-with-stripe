import { BillingInterval, PlanType, SubscriptionStatus } from 'prisma/generated/enums';

export class Subscribtion {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  plan: PlanType;
  interval: BillingInterval;
  status: SubscriptionStatus;
  price: number | null;
}
