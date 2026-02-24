import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { GuestbookService } from './guestbook.service';
import { CreateGuestbookDto, GuestbookEntry } from './guestbook.dto';

@Controller('api/guestbook')
export class GuestbookController {
  constructor(private readonly guestbookService: GuestbookService) {}

  /**
   * GET /api/guestbook
   * Fetch all guestbook entries (most recent first, limit 20)
   */
  @Get()
  async findAll(): Promise<GuestbookEntry[]> {
    try {
      return await this.guestbookService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch guestbook entries',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/guestbook
   * Create a new guestbook entry
   */
  @Post()
  async create(@Body() createDto: CreateGuestbookDto): Promise<GuestbookEntry> {
    // Validation
    if (!createDto.name?.trim()) {
      throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
    }
    if (!createDto.comment?.trim()) {
      throw new HttpException('Comment is required', HttpStatus.BAD_REQUEST);
    }
    if (!createDto.rating || createDto.rating < 1 || createDto.rating > 5) {
      throw new HttpException('Rating must be between 1 and 5', HttpStatus.BAD_REQUEST);
    }

    try {
      const entry = await this.guestbookService.create({
        name: createDto.name.trim(),
        comment: createDto.comment.trim(),
        rating: createDto.rating,
      });
      
      if (!entry) {
        throw new HttpException('Failed to create entry', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      return entry;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to create guestbook entry',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
