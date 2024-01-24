import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as morgan from 'morgan';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: 5 * 1024 * 1024 })
  );

  // set up middlewares ----------------------------
  app.use(morgan('dev'));
  app.use(compression())
  // -----------------------------------------------

  // set up swagger --------------------------------
  const config = new DocumentBuilder()
    .setTitle('Team 74 - API - Document - NJS1710')
    .setDescription('API for user interface development')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      docExpansion: 'none',
    }
  });
  // -----------------------------------------------

  // set up cors --------------------------------
  app.register(require('@fastify/cors'), {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    preflightContinue: true,
  });
  // -----------------------------------------------

  // set up request body validation --------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
      // transform: true,
    }),
  );
  // -----------------------------------------------

  await app.listen(4000);
}
bootstrap();
