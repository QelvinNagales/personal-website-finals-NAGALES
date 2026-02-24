import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// Create a persistent instance for Vercel
let cachedServer: any;

async function bootstrap() {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);

  // Your existing CORS config
  app.enableCors({
    origin: [
      'http://localhost:5173',
      /\.vercel\.app$/,
      /\.netlify\.app$/,
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  });

  await app.init();
  return expressApp;
}

// Export the handler for Vercel
export default async (req: any, res: any) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  cachedServer(req, res);
};