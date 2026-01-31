import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TrailService } from './trail.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTrialDto } from './dto/create-trail.dto';

@UseGuards(JwtAuthGuard)
@Controller('trail')
export class TrailController {

  constructor(private readonly trailService: TrailService) {}


  // =========================Create Trail =========================
  @Post('create')
  async create(
    @Body() createTrialDto: CreateTrialDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.trailService.create(createTrialDto, userId);
  }
 



}
