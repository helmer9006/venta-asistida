import { Module } from '@nestjs/common';
import { AlliesAdvisorService } from './services/allies-advisor.service';
import { AlliesAdvisorController } from './controllers/allies-advisor.controller';

@Module({
  controllers: [AlliesAdvisorController],
  providers: [AlliesAdvisorService]
})
export class AlliesAdvisorModule {}
