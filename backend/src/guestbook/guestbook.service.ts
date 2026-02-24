import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateGuestbookDto, GuestbookEntry } from './guestbook.dto';

@Injectable()
export class GuestbookService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Fetch the latest 20 guestbook entries, ordered by most recent
   */
  async findAll(): Promise<GuestbookEntry[]> {
    const { data, error } = await this.supabase.client
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('GuestbookService.findAll error:', error.message);
      return [];
    }

    return (data as GuestbookEntry[]) ?? [];
  }

  /**
   * Insert a new guestbook entry
   */
  async create(dto: CreateGuestbookDto): Promise<GuestbookEntry | null> {
    const { data, error } = await this.supabase.client
      .from('guestbook')
      .insert([dto])
      .select()
      .single();

    if (error) {
      console.error('GuestbookService.create error:', error.message);
      return null;
    }

    return data as GuestbookEntry;
  }
}
