# Journey Drive Portfolio - Backend

NestJS REST API backend for the Journey Drive Portfolio guestbook.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/guestbook` | Fetch all guestbook entries (limit 20) |
| POST | `/api/guestbook` | Create a new guestbook entry |

### POST /api/guestbook Body

```json
{
  "name": "string (required)",
  "comment": "string (required)",
  "rating": "number 1-5 (required)"
}
```

## Local Development

```bash
# Install dependencies
npm install

# Create .env from .env.example and add your Supabase credentials
cp .env.example .env

# Start development server
npm run start:dev
```

Server runs on http://localhost:3000

## Deploy to Vercel

1. Push the backend folder to a separate GitHub repo (or use monorepo)
2. Import to Vercel
3. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Build command: `npm run build`
5. Output directory: `dist`

## Supabase Setup

Run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.guestbook (
  id         bigserial primary key,
  name       text      not null,
  comment    text      not null,
  rating     int       not null check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

alter table public.guestbook enable row level security;

create policy "Public read" on public.guestbook
  for select using (true);

create policy "Public insert" on public.guestbook
  for insert with check (true);
```
