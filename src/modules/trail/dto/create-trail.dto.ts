import { IsEnum, IsOptional } from 'class-validator';
import { BillingInterval, PlanType } from 'prisma/generated';


export class CreateTrialDto {
  @IsEnum(PlanType)
  plan: PlanType;

  @IsEnum(BillingInterval)
  interval: BillingInterval;
}
