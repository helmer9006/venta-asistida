import { Module } from '@nestjs/common';
import { PermissionsService } from './services/permissions.service';
import { PermissionsController } from './controllers/permissions.controller';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PrismaService, ConfigService],
})
export class PermissionsModule {}
