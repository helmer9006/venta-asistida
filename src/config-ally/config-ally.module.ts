import { Module } from '@nestjs/common';
import { ConfigAllyService } from './config-ally.service';
import { ConfigAllyController } from './config-ally.controller';

@Module({
  controllers: [ConfigAllyController],
  providers: [ConfigAllyService]
})
export class ConfigAllyModule {}
