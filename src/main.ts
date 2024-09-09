import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { GeneralExceptionFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug'],
  });

  const configService = app.get(ConfigService);

  app.useGlobalFilters(new GeneralExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
