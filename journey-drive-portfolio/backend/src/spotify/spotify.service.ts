import { Injectable, Logger } from '@nestjs/common';

// ── Types ────────────────────────────────────────────────────────────────────

interface SpotifyToken {
  access_token: string;
  expires_at: number;
}

export interface SpotifyTrackDto {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  spotifyUrl: string;
  duration: number;
  type: 'track' | 'album';
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class SpotifyService {
  private readonly logger = new Logger(SpotifyService.name);
  private token: SpotifyToken | null = null;
  private readonly clientId = process.env.SPOTIFY_CLIENT_ID || '';
  private readonly clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';

  // ── Auth ─────────────────────────────────────────────────────────────────

  /**
   * Client Credentials Flow — no user login required.
   * Token is cached with a 60-second safety buffer before expiry.
   */
  private async getAccessToken(): Promise<string> {
    if (this.token && Date.now() < this.token.expires_at) {
      return this.token.access_token;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        'SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set as environment variables',
      );
    }

    const authHeader = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authHeader}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!res.ok) {
      const body = await res.text();
      this.logger.error(`Token request failed (${res.status}): ${body}`);
      throw new Error('Failed to obtain Spotify access token');
    }

    const data = await res.json();
    this.token = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in - 60) * 1000, // 60s buffer
    };

    this.logger.log('Spotify access token refreshed');
    return this.token.access_token;
  }

  // ── Resilient Fetch ──────────────────────────────────────────────────────

  /**
   * Wrapper around fetch that handles:
   *   401 → invalidate cached token and retry once
   *   429 → honour Retry-After header, wait, then retry once
   */
  private async apiFetch(url: string, retried = false): Promise<any> {
    const token = await this.getAccessToken();

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 401 Unauthorized → token expired mid-flight
    if (res.status === 401 && !retried) {
      this.logger.warn('Received 401 — refreshing token and retrying');
      this.token = null;
      return this.apiFetch(url, true);
    }

    // 429 Too Many Requests → honour Retry-After header
    if (res.status === 429 && !retried) {
      const retryAfter = parseInt(res.headers.get('Retry-After') || '2', 10);
      this.logger.warn(`Rate-limited — waiting ${retryAfter}s`);
      await new Promise((r) => setTimeout(r, retryAfter * 1000));
      return this.apiFetch(url, true);
    }

    if (!res.ok) {
      const body = await res.text();
      this.logger.error(`Spotify API ${res.status}: ${body}`);
      throw new Error(`Spotify API error (${res.status})`);
    }

    return res.json();
  }

  // ── Public Methods ───────────────────────────────────────────────────────

  async getTrack(trackId: string): Promise<SpotifyTrackDto> {
    const raw = await this.apiFetch(
      `https://api.spotify.com/v1/tracks/${encodeURIComponent(trackId)}`,
    );

    return {
      id: raw.id,
      name: raw.name,
      artist: raw.artists.map((a: any) => a.name).join(', '),
      album: raw.album.name,
      albumArt: raw.album.images[0]?.url || '',
      spotifyUrl: raw.external_urls.spotify,
      duration: raw.duration_ms,
      type: 'track',
    };
  }

  async getAlbum(albumId: string): Promise<SpotifyTrackDto> {
    const raw = await this.apiFetch(
      `https://api.spotify.com/v1/albums/${encodeURIComponent(albumId)}`,
    );

    return {
      id: raw.id,
      name: raw.name,
      artist: raw.artists.map((a: any) => a.name).join(', '),
      album: raw.name,
      albumArt: raw.images[0]?.url || '',
      spotifyUrl: raw.external_urls.spotify,
      duration: raw.tracks.items.reduce(
        (sum: number, t: any) => sum + t.duration_ms,
        0,
      ),
      type: 'album',
    };
  }

  /**
   * Resolve a list of Spotify embed URLs → metadata DTOs.
   * Fetches each individually (bulk endpoint deprecated 2025).
   * Failures are logged and skipped — partial results returned.
   */
  async resolveEmbedUrls(urls: string[]): Promise<SpotifyTrackDto[]> {
    const results: SpotifyTrackDto[] = [];

    for (const url of urls) {
      try {
        const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/);
        const albumMatch = url.match(/album\/([a-zA-Z0-9]+)/);

        if (trackMatch) {
          results.push(await this.getTrack(trackMatch[1]));
        } else if (albumMatch) {
          results.push(await this.getAlbum(albumMatch[1]));
        } else {
          this.logger.warn(`Unrecognised Spotify URL: ${url}`);
        }
      } catch (err) {
        this.logger.error(`Failed to resolve ${url}: ${err}`);
      }
    }

    return results;
  }
}