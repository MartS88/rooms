// main.ts

// Other packages
import path from "path";
import * as fs from "node:fs";
import cookieParser from 'cookie-parser';

// Nest js
import {NestFactory} from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import express from 'express';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import fastifyCors from '@fastify/cors';

// Module
import {AppModule} from './app.module';

// Services
import {ConfigService} from '@nestjs/config';

// Winston
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';

/**
 * Initializes and starts the application.
 * Configures global middleware, Swagger, and application settings.
 */
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const origins = configService
    .get<string>('FRONTEND_ORIGIN')
    ?.split(',')
    .map(origin => origin.trim());


  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.setGlobalPrefix('/api/v1');
  app.use(cookieParser());
  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    optionsSuccessStatus: 204,
  });

  // Using Winston logger for NestJS system logs
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Using Winston logger for manual logging
  const logger = app.get(Logger);
  const PORT = configService.get<number>('PORT') || 5000;

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes properties that are not defined in the DTO
      forbidNonWhitelisted: true, // throws an error if extra (non-whitelisted) properties are present
      transform: true, // automatically transforms payloads to match the DTO types (e.g., string → number)
    }),
  );

  // App starts
  await app.listen(PORT, () => {
    logger.log(`Server started on port ${PORT} in ${configService.get<string>('NODE_ENV')} regime at ${new Date()}`);
  });

}

bootstrap();



// const adapter = new FastifyAdapter();
//
// // Cors Fastify
// await adapter.getInstance().register(fastifyCors, {
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// });
//
// const app = await NestFactory.create(AppModule, adapter);
