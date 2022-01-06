import { Test, TestingModule } from '@nestjs/testing';
import { TransfyController } from './transfy.controller';

describe('TransfyController', () => {
  let controller: TransfyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfyController],
    }).compile();

    controller = module.get<TransfyController>(TransfyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
