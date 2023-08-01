import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { UtilsService } from '@src/shared/services/utils.service';
import { AxiosAdapter } from '@src/shared/adapters/axios.adapter';
import { LogsService } from '@src/logs/services/logs.service';
import { AuthService } from '@src/auth/services/auth.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    UtilsService,
    AxiosAdapter,
    AuthService,
    LogsService,
  ],
})
export class UsersModule {}
