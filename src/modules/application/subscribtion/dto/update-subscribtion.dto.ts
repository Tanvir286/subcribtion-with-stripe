import { PartialType } from '@nestjs/swagger';
import { CreateSubscribtionDto } from './create-subscribtion.dto';

export class UpdateSubscribtionDto extends PartialType(CreateSubscribtionDto) {
  // Inherits all optional fields from CreateSubscribtionDto
}
