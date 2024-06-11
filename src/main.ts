import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fastifyMulter from 'fastify-multer';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as morgan from 'morgan';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import * as multer from 'multer';
import * as multipart from '@fastify/multipart';
import * as fs from "fs"
declare const module: any;

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./src/secrets2/key.pem'),
    cert: fs.readFileSync('./src/secrets2/cert.pem'),
    rejectUnauthorized: false
  };

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: 5 * 1024 * 1024, 
      // https: httpsOptions 
    })
  );


  //app.register(fastifyMulter.contentParser);
  // upload file -----------------------------------
  app.register(multipart);
  const httpAdapterHost = app.get(HttpAdapterHost);

  // set up middlewares ----------------------------
  app.use(morgan('dev'));
  app.use(compression())
  // -----------------------------------------------

  // set up swagger --------------------------------
  const config = new DocumentBuilder()
    .setTitle('Team 92 - API - Document - NJS1710')
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
    origin: ['http://localhost:3000', 'https://capy-venture.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    preflightContinue: true,
  });
  // -----------------------------------------------

  // set up request body validation --------------------------------
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     // disableErrorMessages: true,
  //     // transform: true,
  //   }),
  // );
  // -----------------------------------------------

  await app.listen(4000, "0.0.0.0");

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
