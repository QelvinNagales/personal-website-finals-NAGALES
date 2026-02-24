import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SpotifyModule } from './spotify/spotify.module';

@Module({
  imports: [SpotifyModule],
  controllers: [AppController], // This makes the "/" route work!
})
export class AppModule {}