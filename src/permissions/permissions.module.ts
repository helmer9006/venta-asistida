import { Module } from '@nestjs/common';
import { PermissionsService } from './services/permissions.service';
import { PermissionsController } from './controllers/permissions.controller';
import { PrismaService } from '@src/prisma/services/prisma.service';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PrismaService]
})
export class PermissionsModule { }
