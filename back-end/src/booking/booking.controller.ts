import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileResponseDto } from 'src/user/dto/profile-response.dto';

@ApiTags('Bookings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Đặt vé' })
  create(
    @Req() req: { user: ProfileResponseDto },
    @Body() dto: CreateBookingDto,
  ) {
    console.log('Creating booking for user:', req.user);
    return this.bookingService.create(req.user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết đơn đặt vé' })
  findOne(@Param('id') id: string, @Req() req: { user: ProfileResponseDto }) {
    return this.bookingService.findOne(id, req.user.id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Hủy vé đã đặt' })
  cancel(@Param('id') id: string, @Req() req: { user: ProfileResponseDto }) {
    return this.bookingService.cancel(id, req.user.id);
  }

  @Get(':id/seats')
  @ApiOperation({ summary: 'Trạng thái ghế theo thời gian thực' })
  getSeatsStatus(@Param('id') showtimeId: string) {
    return this.bookingService.getSeatsStatus(showtimeId);
  }
}
