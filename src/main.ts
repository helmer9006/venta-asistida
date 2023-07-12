import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  const passSwagger = process.env.SWAGGER_PASS;
  const config = new DocumentBuilder()
    .setTitle('CS-venta-asistida - Laboratorio digital')
    .setDescription('venta-asistida descripción de servicios.')
    .setVersion('0.1')
    .addTag('venta-asistida')
    .build();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: process.env.APP_CLIENT,
    credentials: true,
  });
  app.use(
    ['/cs/docs', '/cs/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        ventas_docs: passSwagger,
      },
    }),
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('cs/docs', app, document);
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
