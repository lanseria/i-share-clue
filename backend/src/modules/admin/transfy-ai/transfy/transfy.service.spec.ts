import { Test, TestingModule } from '@nestjs/testing';
import { TransfyService } from './transfy.service';

describe('TransfyService', () => {
  let service: TransfyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransfyService],
    }).compile();

    service = module.get<TransfyService>(TransfyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
