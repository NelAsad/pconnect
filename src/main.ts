import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || 3000;

  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(PORT, '0.0.0.0');
  Logger.log(`Application started on port ${PORT}`);
}
bootstrap();
