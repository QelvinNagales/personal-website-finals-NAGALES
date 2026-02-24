import { Controller, Get } from '@nestjs/common';

@Controller() // Keeping this empty handles the root "/"
export class AppController {
  @Get()
  getHello() {
    return { status: 'ok', message: 'NestJS is live on Vercel!' };
  }
}