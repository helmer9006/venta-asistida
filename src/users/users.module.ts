import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { AuditLogs } from '@src/shared/helpers/user-audit-logs';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, AuditLogs],
})
export class UsersModule { }
