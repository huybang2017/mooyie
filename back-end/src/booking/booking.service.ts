import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus, Prisma } from 'generated/prisma';
import { FilterBookingDto } from 'src/booking/dto/filter-booking.dto';
import { PaginationBookingDto } from 'src/booking/dto/pagination-booking.dto';
import { paginate } from 'src/utils/helper/paginate';
import { UpdateBookingDto } from 'src/booking/dto/update-booking.dto';
import { PaymentService } from 'src/payment/payment.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {}

  async create(userId: string, dto: CreateBookingDto) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: dto.showtimeId },
    });

    if (!showtime) throw new NotFoundException('Suất chiếu không tồn tại');

    const existingSeats = Array.isArray(showtime.seats)
      ? (showtime.seats as string[])
      : [];

    const updatedSeats = Array.from(new Set([...existingSeats, ...dto.seats]));

    await this.prisma.showtime.update({
      where: { id: dto.showtimeId },
      data: { seats: updatedSeats },
    });

    // Set expireAt to 30 seconds from now for testing
    const expireAt = new Date(Date.now() + 60 * 1000);

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        showtimeId: dto.showtimeId,
        seats: dto.seats,
        totalPrice: dto.totalPrice,
        status: BookingStatus.PENDING,
        expireAt,
      },
    });

    return booking;
  }

  async findOne(id: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
      include: { showtime: { include: { movie: true } }, payment: true },
    });

    if (!booking) throw new NotFoundException('Không tìm thấy đơn đặt vé');

    return booking;
  }

  async findAllAdmin(
    filter: FilterBookingDto,
    pagination: PaginationBookingDto,
  ) {
    const { page, limit } = pagination;
    const { customerName, theaterName, movieName, status } = filter;

    const where: Prisma.BookingWhereInput = {};

    if (customerName) {
      where.user = {
        name: {
          contains: customerName,
          mode: 'insensitive',
        },
      };
    }

    if (theaterName) {
      where.showtime = {
        room: {
          theater: {
            name: {
              contains: theaterName,
              mode: 'insensitive',
            },
          },
        },
      };
    }

    if (movieName) {
      where.showtime = {
        movie: {
          title: {
            contains: movieName,
            mode: 'insensitive',
          },
        },
      };
    }

    if (status) {
      where.status = status;
    }

    return paginate(this.prisma.booking, {
      where,
      page,
      limit,
      orderBy: { createdAt: 'desc' },
      include: {
        showtime: {
          include: {
            movie: true,
            room: { include: { theater: true } },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            avatar: true,
            createdAt: true,
          },
        },
        payment: true,
      },
    });
  }

  async cancel(id: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id },
    });

    if (!booking) throw new NotFoundException('Đơn không tồn tại');

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new ForbiddenException('Chỉ có thể hủy vé đã đặt');
    }

    const isWithin24h =
      Date.now() - new Date(booking.createdAt).getTime() <= 24 * 60 * 60 * 1000;
    if (!isWithin24h) throw new Error('Quá hạn huỷ');

    await this.paymentService.refund(id);
  }

  async update(id: string, dto: UpdateBookingDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const currentStatus = booking.status;
    const nextStatus = dto.status;

    const immutableStatuses: BookingStatus[] = [
      BookingStatus.CANCELED as BookingStatus,
      BookingStatus.USED as BookingStatus,
      BookingStatus.EXPIRED as BookingStatus,
    ];

    if (immutableStatuses.includes(currentStatus)) {
      throw new ForbiddenException(
        'Cannot update a booking that is completed, cancelled, or expired',
      );
    }

    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [BookingStatus.CONFIRMED],
      [BookingStatus.CONFIRMED]: [
        BookingStatus.CANCELED,
        BookingStatus.USED,
        BookingStatus.EXPIRED,
      ],
      [BookingStatus.CANCELED]: [],
      [BookingStatus.USED]: [],
      [BookingStatus.EXPIRED]: [],
    };

    const allowed = validTransitions[currentStatus] || [];

    if (!allowed.includes(nextStatus)) {
      throw new BadRequestException(
        `Cannot change status from ${currentStatus} to ${nextStatus}`,
      );
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: { status: nextStatus },
    });

    // Send real-time notification to the user
    await this.notificationService.sendToUser(
      updatedBooking.userId,
      `Your ticket status has been updated to "${nextStatus}".`,
      'booking_status'
    );

    return updatedBooking;
  }

  async getSeatsStatus(showtimeId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        showtimeId,
        status: BookingStatus.CONFIRMED,
      },
      select: {
        seats: true,
      },
    });

    return bookings.flatMap((b) => b.seats);
  }

  async isPending(bookingId: string): Promise<boolean> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    return booking?.status === BookingStatus.PENDING;
  }

  async cancelBooking(bookingId: string) {
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELED },
    });
  }

  async releaseSeats(showtimeId: string, seatsToRelease: string[]) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: showtimeId },
    });
    const currentSeats = (showtime?.seats as string[]) ?? [];
    const updatedSeats = currentSeats.filter(
      (seat) => !seatsToRelease.includes(seat),
    );
    await this.prisma.showtime.update({
      where: { id: showtimeId },
      data: { seats: updatedSeats },
    });
  }

  async markAsCONFIRMED(bookingId: string) {
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CONFIRMED },
    });
  }

  async getUserBookings(userId: string) {
    console.log('Fetching bookings for user:', userId);
    if (!userId) {
      throw new NotFoundException('User ID is required');
    }

    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: {
        showtime: {
          include: { movie: true, room: { include: { theater: true } } },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookings;
  }

  async findExpiredBookings() {
    const now = new Date();
    // Lấy tất cả booking CONFIRMED có showtime
    const bookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.CONFIRMED,
      },
      include: {
        showtime: true,
      },
    });

    // Lọc bằng JS: showtime.time là mảng, check nếu có end < now
    const expiredBookings = bookings.filter(b => {
      if (!b.showtime || !Array.isArray(b.showtime.time)) return false;
      return b.showtime.time.some(t =>
        t && typeof t === 'object' && 'end' in t && new Date((t as any).end) < now
      );
    });

    console.log('Expired bookings found:', expiredBookings.map(b => b.id));
    return expiredBookings;
  }

  async handleExpiredBookings() {
    try {
      const expiredBookings = await this.findExpiredBookings();

      for (const booking of expiredBookings) {
        await this.update(booking.id, { status: BookingStatus.EXPIRED });
        console.log(`Booking ${booking.id} marked as expired`);
      }

      return {
        message: `Processed ${expiredBookings.length} expired bookings`,
        count: expiredBookings.length,
      };
    } catch (error) {
      console.error('Error handling expired bookings:', error);
      throw error;
    }
  }

  async getPendingBookingByUserAndShowtime(userId: string, showtimeId: string) {
    if (!userId || !showtimeId) {
      throw new NotFoundException('User ID and Showtime ID are required');
    }

    return this.prisma.booking.findFirst({
      where: {
        userId,
        showtimeId,
        status: BookingStatus.PENDING,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
