import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SpotifyService, SpotifyTrackDto } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotify: SpotifyService) {}

  // ── GET /spotify/track/:id ───────────────────────────────────────────────
  @Get('track/:id')
  async getTrack(@Param('id') id: string): Promise<SpotifyTrackDto> {
    this.validateId(id);
    try {
      return await this.spotify.getTrack(id);
    } catch {
      throw new HttpException(
        `Could not fetch track ${id}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // ── GET /spotify/album/:id ───────────────────────────────────────────────
  @Get('album/:id')
  async getAlbum(@Param('id') id: string): Promise<SpotifyTrackDto> {
    this.validateId(id);
    try {
      return await this.spotify.getAlbum(id);
    } catch {
      throw new HttpException(
        `Could not fetch album ${id}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // ── GET /spotify/resolve?urls=url1,url2 ──────────────────────────────────
  // Accepts comma-separated Spotify embed URLs and returns metadata for each.
  @Get('resolve')
  async resolve(
    @Query('urls') urls: string,
  ): Promise<SpotifyTrackDto[]> {
    if (!urls) {
      throw new HttpException(
        'Query param "urls" is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const urlList = urls.split(',').map((u) => u.trim()).filter(Boolean);

    if (urlList.length > 20) {
      throw new HttpException(
        'Maximum 20 URLs per request',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.spotify.resolveEmbedUrls(urlList);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  private validateId(id: string): void {
    if (!/^[a-zA-Z0-9]{22}$/.test(id)) {
      throw new HttpException(
        'Invalid Spotify ID format',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}