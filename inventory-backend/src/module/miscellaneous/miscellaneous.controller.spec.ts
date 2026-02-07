import { Test, TestingModule } from '@nestjs/testing';
import { MiscellaneousController } from './miscellaneous.controller';
import { MiscellaneousService } from './miscellaneous.service';

describe('MiscellaneousController', () => {
  let controller: MiscellaneousController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MiscellaneousController],
      providers: [MiscellaneousService],
    }).compile();

    controller = module.get<MiscellaneousController>(MiscellaneousController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
