export interface GuestbookEntry {
  id?: number;
  name: string;
  comment: string;
  rating: number;
  created_at?: string;
}

export interface CreateGuestbookDto {
  name: string;
  comment: string;
  rating: number;
}
