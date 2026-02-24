import { Module } from '@nestjs/common';
import { GuestbookController } from './guestbook.controller';
import { GuestbookService } from './guestbook.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [GuestbookController],
  providers: [GuestbookService, SupabaseService],
})
export class GuestbookModule {}
