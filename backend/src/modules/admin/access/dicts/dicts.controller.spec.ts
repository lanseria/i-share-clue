import { Test, TestingModule } from '@nestjs/testing';
import { DictsController } from './dicts.controller';

describe('DictsController', () => {
  let controller: DictsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictsController],
    }).compile();

    controller = module.get<DictsController>(DictsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
