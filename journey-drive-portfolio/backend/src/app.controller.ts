import { Controller, Get } from '@nestjs/common';

@Controller() // Ensure this is empty to catch the root "/"
export class AppController {
  @Get() // This matches the base URL
  getHello() {
    return { message: 'Backend is live!' };
  }
}