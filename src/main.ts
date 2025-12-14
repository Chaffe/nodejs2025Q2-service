import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import 'dotenv/config';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const loggingService = app.get(LoggingService);

  // Handle uncaughtException
  process.on('uncaughtException', (error: Error) => {
    loggingService.error(
      `Uncaught Exception: ${error.message}`,
      error.stack,
      'UncaughtException',
    );
    process.exit(1);
  });

  // Handle unhandledRejection
  process.on('unhandledRejection', (reason: unknown) => {
    const message = reason instanceof Error ? reason.message : String(reason);
    const stack = reason instanceof Error ? reason.stack : undefined;
    loggingService.error(
      `Unhandled Rejection: ${message}`,
      stack,
      'UnhandledRejection',
    );
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const yamlFile = readFileSync('./doc/api.yaml', 'utf8');
  const swaggerDocument = parse(yamlFile);
  SwaggerModule.setup('doc', app, swaggerDocument);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  loggingService.log(
    `Application is running on: http://localhost:${port}`,
    'Bootstrap',
  );
  loggingService.log(
    `Swagger documentation: http://localhost:${port}/doc`,
    'Bootstrap',
  );
}
bootstrap();
