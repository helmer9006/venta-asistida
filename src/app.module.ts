import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import config from './config/config';
import * as Joi from 'joi';
import { environments } from './config/environments';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ConfigAllyModule } from './config-ally/config-ally.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
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
    UsersModule,
    RolesModule,
    PermissionsModule,
    ConfigAllyModule,
    LogsModule,
  ],
  controllers: [],
})
export class AppModule { }
