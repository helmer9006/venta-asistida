import { Module } from '@nestjs/common';
import { LogsService } from './services/logs.service';
import { LogsController } from './controllers/logs.controller';
import { PrismaService } from '@src/prisma/services/prisma.service';

@Module({
  controllers: [LogsController],
  providers: [LogsService, PrismaService]
})
export class LogsModule { }
