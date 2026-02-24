import { Module } from '@nestjs/common';
import { AppController } from './app.controller'; // Import it here
import { SpotifyModule } from './spotify/spotify.module';
import { GuestbookModule } from './guestbook/guestbook.module';

@Module({
  imports: [SpotifyModule, GuestbookModule],
  controllers: [AppController], // Add it to this array
  providers: [],
})
export class AppModule {}