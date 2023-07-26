import { Module } from '@nestjs/common';
import { ConfigAllyService } from './services/config-ally.service';
import { ConfigAllyController } from './controllers/config-ally.controller';
import { PrismaService } from '@src/prisma/services/prisma.service';

@Module({
  controllers: [ConfigAllyController],
  providers: [ConfigAllyService, PrismaService],
})
export class ConfigAllyModule {}
