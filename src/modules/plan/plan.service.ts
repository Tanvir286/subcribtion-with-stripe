import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { throwError } from 'rxjs';

@Injectable()
export class PlanService {
  constructor(private prisma: PrismaService) {}

  // create a new plan
  async create(createPlanDto: CreatePlanDto) {
    const {
      type,
      per_video,
      unlimited_videos,
      branding,
      custom_thumbnail,
      seo_optimization,
    } = createPlanDto;

    // Check if plan type already exists (optional but recommended)
    const existingPlan = await this.prisma.plan.findUnique({
      where: { type },
    });

    if (existingPlan) {
      throw new BadGatewayException('Plan with this type already exists');
    }

    const plan = await this.prisma.plan.create({
      data: {
        type,
        per_video,
        unlimited_videos,
        branding,
        custom_thumbnail,
        seo_optimization,
      },
    });

    return {
      success: true,
      message: 'Plan created successfully',
      data: plan,
    };
  }

  // get all plans
  async getAll() {
    const plans = await this.prisma.plan.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'asc' },
    });

    return {
      success: true,
      data: plans,
    };
  }

  // update a plan by id
  async update(id: string, updatePlanDto: UpdatePlanDto) {
    const {
      type,
      per_video,
      unlimited_videos,
      branding,
      custom_thumbnail,
      seo_optimization,
    } = updatePlanDto;

    const data: any = {};

    if (per_video !== undefined) data.per_video = per_video;
    if (unlimited_videos !== undefined)
      data.unlimited_videos = unlimited_videos;
    if (branding !== undefined) data.branding = branding;
    if (custom_thumbnail !== undefined)
      data.custom_thumbnail = custom_thumbnail;
    if (seo_optimization !== undefined)
      data.seo_optimization = seo_optimization;

    const existingPlan = await this.prisma.plan.findUnique({
      where: { id: String(id) },
    });
    if (!existingPlan) {
      throw new Error(`Plan with id ${id} not found`);
    }

    if (type) throw new BadGatewayException('Plan type cannot be updated');

    const plan = await this.prisma.plan.update({
      where: { id },
      data: data,
    });

    return {
      success: true,
      message: 'Plan updated successfully',
      data: plan,
    };
  }
}
