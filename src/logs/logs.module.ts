import { Module } from '@nestjs/common';
import { LogsService } from './services/logs.service';
import { LogsController } from './controllers/logs.controller';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { UtilsService } from '@src/shared/services/utils.service';
import { AxiosAdapter } from '@src/shared/adapters/axios.adapter';

@Module({
  controllers: [LogsController],
  providers: [LogsService, PrismaService, UtilsService, AxiosAdapter],
})
export class LogsModule {}
