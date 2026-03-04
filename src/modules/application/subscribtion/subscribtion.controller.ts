import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubscribtionService } from './subscribtion.service';
import { CreateSubscribtionDto } from './dto/create-subscribtion.dto';
import { UpdateSubscribtionDto } from './dto/update-subscribtion.dto';
import { BillingInterval } from 'prisma/generated/enums';

@Controller('subscriptions')
export class SubscribtionController {
  constructor(private readonly subscribtionService: SubscribtionService) {}

  @Post()
  create(@Body() createSubscribtionDto: CreateSubscribtionDto) {
    return this.subscribtionService.create(createSubscribtionDto);
  }

  @Get()
  findAll(@Query('interval') interval?: BillingInterval) {
    return this.subscribtionService.findAll(interval);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscribtionDto: UpdateSubscribtionDto,
  ) {
    return this.subscribtionService.update(id, updateSubscribtionDto);
  }
}
