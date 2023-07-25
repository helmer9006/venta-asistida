import { Module } from '@nestjs/common';
import { ConfigAllyService } from './services/config-ally.service';
import { ConfigAllyController } from './controllers/config-ally.controller';

@Module({
  controllers: [ConfigAllyController],
  providers: [ConfigAllyService]
})
export class ConfigAllyModule {}
