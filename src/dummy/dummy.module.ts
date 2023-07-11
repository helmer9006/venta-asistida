import { DummyService } from './services/dummy.service';
import { JwtService } from '@nestjs/jwt';
import { DummyController } from './controllers/dummy.controller';
import { Module } from '@nestjs/common';
import { AdapterModule } from 'src/adapter/adapter.module';
import { PrismaModule } from '@src/prisma/prisma.module';
import { PrismaService } from '@src/prisma/services/prisma.service';

@Module({
  imports: [AdapterModule, PrismaModule],
  controllers: [DummyController],
  providers: [DummyService, JwtService, PrismaService],
})
export class DummyModule {}
