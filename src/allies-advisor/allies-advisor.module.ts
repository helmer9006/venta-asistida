import { Module } from '@nestjs/common';
import { AlliesAdvisorService } from './services/allies-advisor.service';
import { AlliesAdvisorController } from './controllers/allies-advisor.controller';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { UtilsService } from '@src/shared/services/utils.service';
import { AxiosAdapter } from '@src/shared/adapters/axios.adapter';

@Module({
  controllers: [AlliesAdvisorController],
  providers: [AlliesAdvisorService, PrismaService, UtilsService, AxiosAdapter],
})
export class AlliesAdvisorModule {}
