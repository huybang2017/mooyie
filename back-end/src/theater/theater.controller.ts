import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { TheaterService } from './theater.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorate/roles.decorator';
import { Role } from 'generated/prisma';
import { FilterTheaterDto } from 'src/theater/dto/filter-theater.dto';
import { PaginationTheaterDto } from 'src/theater/dto/pagination-theater.dto';
import { UpdateTheaterDto } from 'src/theater/dto/update-theater.dto';

@ApiTags('Theaters')
@Controller('theaters')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @Get()
  getAll() {
    return this.theaterService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @Get('admin')
  @ApiQuery({ name: 'name', required: false, description: 'Tìm theo tên rạp' })
  @ApiQuery({
    name: 'location',
    required: false,
    description: 'Tìm theo địa điểm',
  })
  @ApiQuery({
    name: 'brand',
    required: false,
    description: 'Tìm theo thương hiệu rạp',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Trạng thái rạp (active/inactive)',
    example: 'active',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Trang hiện tại',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng mỗi trang',
    example: 10,
  })
  getAllAdmin(
    @Query() filter: FilterTheaterDto,
    @Query() pagination: PaginationTheaterDto,
  ) {
    return this.theaterService.findAllAdmin(filter, pagination);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @Post()
  @ApiOperation({ summary: 'Tạo rạp chiếu mới (Admin)' })
  @ApiBody({ type: CreateTheaterDto })
  create(@Body() dto: CreateTheaterDto) {
    return this.theaterService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin rạp (Admin)' })
  @ApiBody({ type: UpdateTheaterDto })
  update(@Body() dto: UpdateTheaterDto, @Param('id') id: string) {
    return this.theaterService.update(dto, id);
  }
}
