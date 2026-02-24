import { Module } from '@nestjs/common';
import { GuestbookModule } from './guestbook/guestbook.module';
import { SpotifyModule } from './spotify/spotify.module';

@Module({
  imports: [GuestbookModule, SpotifyModule],
})
export class AppModule {}
