import { Test, TestingModule } from '@nestjs/testing';
import { AlliesAdvisorController } from './controllers/allies-advisor.controller';
import { AlliesAdvisorService } from './services/allies-advisor.service';

describe('AlliesAdvisorController', () => {
  let controller: AlliesAdvisorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlliesAdvisorController],
      providers: [AlliesAdvisorService],
    }).compile();

    controller = module.get<AlliesAdvisorController>(AlliesAdvisorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
