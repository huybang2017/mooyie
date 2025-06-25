import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorate/roles.decorator';
import { Role } from 'generated/prisma';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Showtimes')
@Controller('showtimes')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách suất chiếu' })
  findAll() {
    return this.showtimeService.findAll();
  }

  @Get('/movies/:id')
  @ApiOperation({ summary: 'Lấy suất chiếu theo phim' })
  findByMovie(@Param('id') movieId: string) {
    return this.showtimeService.findByMovieId(movieId);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '(Admin) Tạo suất chiếu' })
  create(@Body() dto: CreateShowtimeDto) {
    return this.showtimeService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '(Admin) Cập nhật suất' })
  update(@Param('id') id: string, @Body() dto: UpdateShowtimeDto) {
    return this.showtimeService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '(Admin) Xóa suất' })
  remove(@Param('id') id: string) {
    return this.showtimeService.remove(id);
  }
}
