import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscribtionService } from './subscribtion.service';
import { CreateSubscribtionDto } from './dto/create-subscribtion.dto';
import { UpdateSubscribtionDto } from './dto/update-subscribtion.dto';

@Controller('subscribtion')
export class SubscribtionController {
  
  constructor(private readonly subscribtionService: SubscribtionService) {}

  @Post()
  create(@Body() createSubscribtionDto: CreateSubscribtionDto) {
    return this.subscribtionService.create(createSubscribtionDto);
  }

  @Get()
  findAll() {
    return this.subscribtionService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscribtionDto: UpdateSubscribtionDto) {
    return this.subscribtionService.update(+id, updateSubscribtionDto);
  }

  


}
