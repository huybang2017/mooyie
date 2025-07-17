import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileResponseDto } from 'src/user/dto/profile-response.dto';
import { FilterBookingDto } from 'src/booking/dto/filter-booking.dto';
import { PaginationBookingDto } from 'src/booking/dto/pagination-booking.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorate/roles.decorator';
import { Role } from 'generated/prisma';
import { UpdateBookingDto } from 'src/booking/dto/update-booking.dto';

@ApiTags('Bookings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/admin')
  @ApiOperation({
    summary: 'Lấy danh sách đơn đặt vé (Admin)',
    description:
      'API dành cho admin để lấy danh sách các đơn đặt vé với bộ lọc và phân trang.',
  })
  getAllAdmin(
    @Query() filter: FilterBookingDto,
    @Query() pagination: PaginationBookingDto,
  ) {
    return this.bookingService.findAllAdmin(filter, pagination);
  }

  @Post()
  @ApiOperation({ summary: 'Đặt vé' })
  create(
    @Req() req: { user: ProfileResponseDto },
    @Body() dto: CreateBookingDto,
  ) {
    console.log('Creating booking for user:', req.user);
    return this.bookingService.create(req.user.id, dto);
  }

  @Get('user')
  @ApiOperation({ summary: 'Lấy danh sách đơn đặt vé của người dùng' })
  getUserBookings(@Req() req: { user: ProfileResponseDto }) {
    return this.bookingService.getUserBookings(req.user.id);
  }

  @Get('pending')
  async getPendingBooking(
    @Query('showtimeId') showtimeId: string,
    @Req() req: { user: ProfileResponseDto },
  ) {
    const userId = req.user.id;
    return this.bookingService.getPendingBookingByUserAndShowtime(
      userId,
      showtimeId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết đơn đặt vé' })
  findOne(@Param('id') id: string, @Req() req: { user: ProfileResponseDto }) {
    return this.bookingService.findOne(id, req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn đặt vé' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Hủy vé đã đặt' })
  cancel(@Param('id') id: string) {
    return this.bookingService.cancel(id);
  }

  @Get(':id/seats')
  @ApiOperation({ summary: 'Trạng thái ghế theo thời gian thực' })
  getSeatsStatus(@Param('id') showtimeId: string) {
    return this.bookingService.getSeatsStatus(showtimeId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('check-expired')
  @ApiOperation({ summary: 'Check and update expired bookings (Admin)' })
  async checkExpiredBookings() {
    return this.bookingService.handleExpiredBookings();
  }
}
