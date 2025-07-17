import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorate/roles.decorator';
import { Role } from 'generated/prisma';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { FilterShowTimeDto } from 'src/showtime/dto/fitler-showtime.dto';
import { PaginationShowtimeDto } from 'src/showtime/dto/pagination-showitme.dto';
import { FilterShowTimeByMovieDto } from 'src/showtime/dto/filter-showtime-movie.dto';

@ApiTags('Showtimes')
@Controller('showtimes')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách suất chiếu' })
  findAll() {
    return this.showtimeService.findAll();
  }

  @Get('/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '(Admin) Danh sách suất chiếu' })
  @ApiQuery({
    name: 'movie',
    required: false,
    type: String,
    description: 'Lọc theo tên phim',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Lọc theo trạng thái chiếu',
  })
  @ApiQuery({
    name: 'time',
    required: false,
    type: String,
    description: 'Lọc theo thời gian chiếu (ISO 8601 format)',
    example: '2023-10-01T14:00:00Z',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Trang hiện tại',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng mỗi trang',
  })
  findAllAdmin(
    @Query() filter: FilterShowTimeDto,
    @Query() pagination: PaginationShowtimeDto,
  ) {
    return this.showtimeService.findAllAdmin(filter, pagination);
  }

  @Get('/movies/:id')
  @ApiOperation({ summary: 'Lấy suất chiếu theo phim' })
  findByMovie(
    @Param('id') movieId: string,
    @Query() filter: FilterShowTimeByMovieDto,
  ) {
    return this.showtimeService.findByMovieId(movieId, filter);
  }

  @Get(':id')
  async getShowtimeDetail(@Param('id') id: string) {
    return this.showtimeService.getShowtimeWithSeatStatus(id);
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
