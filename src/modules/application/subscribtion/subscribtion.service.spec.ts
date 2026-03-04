import { Test, TestingModule } from '@nestjs/testing';
import { SubscribtionService } from './subscribtion.service';

describe('SubscribtionService', () => {
  let service: SubscribtionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscribtionService],
    }).compile();

    service = module.get<SubscribtionService>(SubscribtionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
