import { DummyModule } from './dummy/dummy.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import config from './config/config';
import * as Joi from 'joi';
import { environments } from './config/environments';
import { RouterModule } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PrismaService } from './prisma/services/prisma.service';

@Module({
  imports: [
    DummyModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      load: [config],
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        EXAMPLE_PROVIDER_GET_SERVICE: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),

        SWAGGER_PASS: Joi.string().required(),
      }),
    }),
    AuthModule,
    RouterModule.register([
      {
        path: 'api/v1',
        children: [
          {
            path: 'dummy',
            module: DummyModule,
          },
        ],
      },
    ]),
    UsersModule,
    RolesModule,
  ],
  controllers: [],
})
export class AppModule { }
