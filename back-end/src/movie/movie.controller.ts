import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorate/roles.decorator';
import { Role } from 'generated/prisma';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { FilterMovieDto } from 'src/movie/dto/filter-movie.dto';
import { PaginationMovieDto } from 'src/movie/dto/pagination-movie.dto';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @ApiQuery({ name: 'genre', required: false })
  @ApiQuery({ name: 'cinemaId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query() filter: FilterMovieDto,
    @Query() pagination: PaginationMovieDto,
  ) {
    return this.movieService.findAll(filter, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết phim' })
  @ApiResponse({ status: 200, description: 'Chi tiết phim' })
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '(Admin) Tạo phim' })
  @ApiResponse({ status: 201, description: 'Phim được tạo' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '(Admin) Cập nhật phim' })
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '(Admin) Xóa phim' })
  remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }
}
