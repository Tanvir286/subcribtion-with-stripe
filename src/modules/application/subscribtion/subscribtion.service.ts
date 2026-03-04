import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSubscribtionDto } from './dto/create-subscribtion.dto';
import { UpdateSubscribtionDto } from './dto/update-subscribtion.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BillingInterval } from 'prisma/generated';

@Injectable()
export class SubscribtionService {
  constructor(private prisma: PrismaService) {}

  // CREATE SUBSCRIPTION PLAN
  async create(createSubscribtionDto: CreateSubscribtionDto) {
    try {
      const plan = await this.prisma.subscriptionPlan.create({
        data: createSubscribtionDto,
      });

      return {
        success: true,
        message: 'Subscription plan created successfully',
        data: plan,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create subscription plan',
      );
    }
  }

  // GET ALL SUBSCRIPTION PLANS
  async findAll(interval?: BillingInterval) {
    const plans = await this.prisma.subscriptionPlan.findMany({
      where: {
        deleted_at: null,
        ...(interval && { interval: interval }),
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return {
      success: true,
      message: 'Subscription plans retrieved successfully',
      data: plans,
    };
  }

  // UPDATE PLAN
  async update(id: string, updateSubscribtionDto: UpdateSubscribtionDto) {
    // Check if plan exists
    const existingPlan = await this.prisma.subscriptionPlan.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!existingPlan) {
      throw new NotFoundException('Subscription plan not found');
    }

    try {
      const updatedPlan = await this.prisma.subscriptionPlan.update({
        where: { id },
        data: updateSubscribtionDto,
      });

      return {
        success: true,
        message: 'Subscription plan updated successfully',
        data: updatedPlan,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update subscription plan',
      );
    }
  }
}
