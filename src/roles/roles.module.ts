import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [RolesController],
  providers: [RolesService, PrismaService, ConfigService]
})
export class RolesModule { }
