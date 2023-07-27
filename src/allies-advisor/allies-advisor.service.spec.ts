import { Test, TestingModule } from '@nestjs/testing';
import { AlliesAdvisorService } from './services/allies-advisor.service';

describe('AlliesAdvisorService', () => {
  let service: AlliesAdvisorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlliesAdvisorService],
    }).compile();

    service = module.get<AlliesAdvisorService>(AlliesAdvisorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
