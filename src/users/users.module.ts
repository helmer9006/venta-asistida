import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { PrismaService } from '@src/prisma/services/prisma.service';
import { UtilsService } from '@src/shared/services/utils.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UtilsService],
})
export class UsersModule { }
