import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from 'generated/prisma';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: dto.showtimeId },
    });

    if (!showtime) throw new NotFoundException('Suất chiếu không tồn tại');

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        showtimeId: dto.showtimeId,
        seats: dto.seats,
        totalPrice: dto.totalPrice,
        status: BookingStatus.BOOKED,
      },
    });

    return booking;
  }

  async findOne(id: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
      include: { showtime: true, payment: true },
    });

    if (!booking) throw new NotFoundException('Không tìm thấy đơn đặt vé');

    return booking;
  }

  async cancel(id: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
    });

    if (!booking) throw new NotFoundException('Đơn không tồn tại');

    if (booking.status !== BookingStatus.BOOKED) {
      throw new ForbiddenException('Chỉ có thể hủy vé đã đặt');
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELED,
      },
    });
  }

  async getSeatsStatus(showtimeId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        showtimeId,
        status: BookingStatus.BOOKED,
      },
      select: {
        seats: true,
      },
    });

    return bookings.flatMap((b) => b.seats);
  }
}
