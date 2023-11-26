import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getEnv } from './utils/config/get-env';
import { SWAGGER_API_KEY_NAME } from './constants/open-api/swagger.constants';
import helmet from 'helmet';
import * as fs from 'fs';

async function bootstrap() {
  const { openApiDocs, port, https: usesHttps } = getEnv();

  const app = await NestFactory.create(
    AppModule,
    usesHttps
      ? {
          httpsOptions: {
            key: fs.readFileSync('/app/certificates/key.pem'),
            cert: fs.readFileSync('/app/certificates/cert.pem'),
          },
        }
      : {},
  );

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Headers security
  app.use(helmet());

  if (openApiDocs) {
    const config = new DocumentBuilder()
      .setTitle('Mangas API')
      .setDescription('The Mangas API web documentation')
      .setVersion('1.5.0')
      .addBasicAuth(
        { type: 'apiKey', name: 'api-key', in: 'header' },
        SWAGGER_API_KEY_NAME,
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('documentation', app, document);
  }

  await app.listen(port);
}
bootstrap();
