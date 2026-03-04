import { Injectable } from '@nestjs/common';
import { CreateSubscribtionDto } from './dto/create-subscribtion.dto';
import { UpdateSubscribtionDto } from './dto/update-subscribtion.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscribtionService {

  constructor(
    private prisma: PrismaService
  ) {}


  create(createSubscribtionDto: CreateSubscribtionDto) {
    return 'This action adds a new subscribtion';
  }

  findAll() {
    return `This action returns all subscribtion`;
  }

  update(id: number, updateSubscribtionDto: UpdateSubscribtionDto) {
    return `This action updates a #${id} subscribtion`;
  }

}
