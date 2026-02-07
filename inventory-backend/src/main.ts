import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { httpExceptionFilter, ZodExceptionFilter } from './shared/global';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalFilters(httpExceptionFilter, new ZodExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
