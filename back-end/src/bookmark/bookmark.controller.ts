import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileResponseDto } from 'src/user/dto/profile-response.dto';

@ApiTags('Bookmarks')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  @ApiOperation({ summary: 'Thêm phim vào bookmark' })
  async create(
    @Body() dto: CreateBookmarkDto,
    @Req() req: { user: ProfileResponseDto },
  ) {
    console.log(req);

    return this.bookmarkService.create(req.user.id, dto);
  }

  @Delete(':movieId')
  @ApiOperation({ summary: 'Gỡ phim khỏi bookmark' })
  async remove(
    @Param('movieId') movieId: string,
    @Req() req: { user: ProfileResponseDto },
  ) {
    return this.bookmarkService.remove(req.user.id, movieId);
  }
}
