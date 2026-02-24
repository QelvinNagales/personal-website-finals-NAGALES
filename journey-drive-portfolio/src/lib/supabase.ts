import { createClient } from '@supabase/supabase-js';

// ────────────────────────────────────────────────────────────────────────────────
// Configuration
// ────────────────────────────────────────────────────────────────────────────────

// Backend API URL (NestJS server)
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Supabase direct connection (fallback if backend unavailable)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ────────────────────────────────────────────────────────────────────────────────
// Storage helpers
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Get public URL for an image in Supabase storage
 * @param bucket - The storage bucket name (e.g., 'billboards')
 * @param path - The file path within the bucket (e.g., 'Grad.png')
 */
export function getStorageUrl(bucket: string, path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

// ────────────────────────────────────────────────────────────────────────────────
// Guestbook helpers (calls NestJS backend REST API)
// ────────────────────────────────────────────────────────────────────────────────

export interface GuestbookEntry {
  id?: number;
  name: string;
  comment: string;
  rating: number;           // 1-5 stars
  created_at?: string;
}

/** 
 * GET /api/guestbook
 * Fetch the latest guestbook entries — tries NestJS backend first, falls back to Supabase direct.
 */
export async function fetchGuestbook(): Promise<GuestbookEntry[]> {
  // Try NestJS backend first
  try {
    const response = await fetch(`${API_URL}/api/guestbook`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Backend unavailable — fall through to Supabase direct
  }

  // Fallback: query Supabase directly
  try {
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    return (data as GuestbookEntry[]) ?? [];
  } catch (error) {
    console.error('fetchGuestbook error:', error);
    return [];
  }
}

/** 
 * POST /api/guestbook
 * Insert a new guestbook entry — tries NestJS backend first, falls back to Supabase direct.
 */
export async function insertGuestbook(
  entry: Omit<GuestbookEntry, 'id' | 'created_at'>,
): Promise<GuestbookEntry | null> {
  // Try NestJS backend first
  try {
    const response = await fetch(`${API_URL}/api/guestbook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Backend unavailable — fall through to Supabase direct
  }

  // Fallback: insert via Supabase directly
  try {
    const { data, error } = await supabase
      .from('guestbook')
      .insert([entry])
      .select()
      .single();
    if (error) throw error;
    return data as GuestbookEntry;
  } catch (error) {
    console.error('insertGuestbook error:', error);
    return null;
  }
}

/*
  ─────────  Supabase SQL to create the table  ─────────

  Run this once in the Supabase SQL Editor:

  create table if not exists public.guestbook (
    id         bigserial primary key,
    name       text      not null,
    comment    text      not null,
    rating     int       not null check (rating between 1 and 5),
    created_at timestamptz not null default now()
  );

  -- Allow anyone to read and insert (public portfolio guestbook)
  alter table public.guestbook enable row level security;

  create policy "Public read" on public.guestbook
    for select using (true);

  create policy "Public insert" on public.guestbook
    for insert with check (true);
*/
