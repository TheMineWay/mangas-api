import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getEnv } from './utils/config/get-env';

async function bootstrap() {
  const { openApiDocs } = getEnv();

  const app = await NestFactory.create(AppModule);

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  if (openApiDocs) {
    const config = new DocumentBuilder()
      .setTitle('Mangas API')
      .setDescription('The Mangas API documentation')
      .setVersion('1.0.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('documentation', app, document);
  }

  await app.listen(3000);
}
bootstrap();
