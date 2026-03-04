import { BillingInterval, PlanType, SubscriptionStatus } from 'prisma/generated/enums';
import { IsEnum, IsOptional, IsDecimal } from 'class-validator';

export class CreateSubscribtionDto {
  @IsEnum(PlanType)
  plan: PlanType;

  @IsEnum(BillingInterval)
  interval: BillingInterval;

  @IsOptional()
  @IsDecimal()
  price?: number;
}
