import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AxiosAdapter } from '@src/shared/adapters/axios.adapter';
import { UtilsService } from '@src/shared/services/utils.service';
import { LogsService } from '@src/logs/services/logs.service';

@Module({
  controllers: [RolesController],
  providers: [
    RolesService,
    PrismaService,
    JwtService,
    ConfigService,
    UtilsService,
    AxiosAdapter,
    LogsService,
  ],
})
export class RolesModule {}
