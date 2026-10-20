import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.setGlobalPrefix('api');
  // Keep the existing Vite proxy path working while exposing the documented /api routes.
  app.use((request: { url: string }, _response: unknown, next: () => void) => {
    if (request.url === '/todos' || request.url.startsWith('/todos?')) {
      request.url = `/api${request.url}`;
    } else if (request.url.startsWith('/todos/')) {
      request.url = `/api${request.url}`;
    } else if (request.url === '/profile' || request.url.startsWith('/profile?')) {
      request.url = `/api${request.url}`;
    } else if (request.url.startsWith('/profile/')) {
      request.url = `/api${request.url}`;
    }
    next();
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();


