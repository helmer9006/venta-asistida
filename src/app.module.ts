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
import { AlliesAdvisorModule } from './allies-advisor/allies-advisor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      load: [config],
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        SWAGGER_PASS: Joi.string().required(),
        PORT: Joi.string().required(),
        APP_CLIENT_ID: Joi.string().required(),
        SESSION_SECRET: Joi.string().required(),
        APP_CLIENT_SECRET: Joi.string().required(),
        SIGN_UP_SIGN_IN_POLICY_AUTHORITY: Joi.string().required(),
        RESET_PASSWORD_POLICY_AUTHORITY: Joi.string().required(),
        EDIT_PROFILE_POLICY_AUTHORITY: Joi.string().required(),
        AUTHORITY_DOMAIN: Joi.string().required(),
        APP_REDIRECT_URI: Joi.string().required(),
        LOGOUT_ENDPOINT: Joi.string().required(),
        IDENTITY_METADATA: Joi.string().required(),
        ID_ROLE_ADMIN: Joi.string().required(),
        ID_ROLE_SUPERADMIN: Joi.string().required(),
        ID_ROLE_ADVISOR: Joi.string().required(),
        ID_ROLE_ALLY: Joi.string().required(),
        ID_ROLE_SUPERVISOR: Joi.string().required(),
        MULE_URL_SEND_EMAIL: Joi.string().required(),
        MULE_URL_SEND_SMS_OTP: Joi.string().required(),
        MULE_URL_SEND_SMS_OTP_VALIDATE: Joi.string().required(),
        MULE_URL_GENERATE_TOKEN: Joi.string().required(),
        MULE_CLIENT_ID: Joi.string().required(),
        MULE_CLIENT_SECRET: Joi.string().required(),
        MULE_GRANT_TYPE: Joi.string().required(),
        MULE_CLIENT_ID_METHOD: Joi.string().required(),
        MULE_CLIENT_SECRET_METHOD: Joi.string().required(),
      }),
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    ConfigAllyModule,
    LogsModule,
    AlliesAdvisorModule,
  ],
  controllers: [],
})
export class AppModule {}
