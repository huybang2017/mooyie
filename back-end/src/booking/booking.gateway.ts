import { forwardRef, Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { BookingStatus } from 'generated/prisma';
import { Server, Socket } from 'socket.io';
import { BookingService } from 'src/booking/booking.service';
import { CreateBookingDto } from 'src/booking/dto/create-booking.dto';
import { PaymentService } from 'src/payment/payment.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/bookings',
})
export class BookingGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private clientMap = new Map<string, string>(); 
  private bookingTimers = new Map<string, NodeJS.Timeout>(); 

  constructor(
    @Inject(forwardRef(() => BookingService))
    private readonly bookingService: BookingService,

    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    for (const [userId, socketId] of this.clientMap.entries()) {
      if (socketId === client.id) {
        this.clientMap.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('register-user')
  handleRegisterUser(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.clientMap.set(data.userId, client.id);
  }

  @SubscribeMessage('create-booking')
  async handleCreateBooking(
    @MessageBody() data: { userId: string; dto: CreateBookingDto },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { userId, dto } = data;

      // 1. Create booking with PENDING status
      const booking = await this.bookingService.create(userId, dto);
      this.server.to(client.id).emit('booking-created', booking);

      // 2. Broadcast seat update to all connected clients
      this.server.emit('seats-updated', {
        showtimeId: dto.showtimeId,
        seats: dto.seats,
        status: 'pending',
      });

      // 3. Create payment with PENDING status
      const payment = await this.paymentService.createPendingPayment(
        booking.id,
      );
      this.server.to(client.id).emit('payment-created', payment);

      // 3. Start 5-minute timer for payment
      const timer = setTimeout(() => {
        void (async () => {
          const isStillPending = await this.bookingService.isPending(
            booking.id,
          );
          if (isStillPending) {
            // Case 3: Timeout - cancel booking and release seats
            await this.bookingService.cancelBooking(booking.id);
            await this.bookingService.releaseSeats(dto.showtimeId, dto.seats);
            await this.paymentService.markPaymentAsFailed(booking.id);

            // Broadcast seat release to all connected clients
            this.server.emit('seats-updated', {
              showtimeId: dto.showtimeId,
              seats: dto.seats,
              status: 'released',
            });

            this.server.to(client.id).emit('booking-timeout', {
              bookingId: booking.id,
            });

            this.bookingTimers.delete(booking.id);
          }
        })();
      }, 60 * 1000);

      this.bookingTimers.set(booking.id, timer);

      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      this.server.to(client.id).emit('booking-error', {
        message: 'Failed to create booking',
      });
    }
  }

  async notifyPaymentStatus(
    userId: string,
    status: 'success' | 'failed',
    bookingId: string,
  ) {
    const socketId = this.clientMap.get(userId);
    if (!socketId) return;

    // Không update DB ở đây nữa, chỉ emit sự kiện realtime
    if (status === 'success') {
      // Clear timer nếu có
      const timer = this.bookingTimers.get(bookingId);
      if (timer) {
        clearTimeout(timer);
        this.bookingTimers.delete(bookingId);
      }
      this.server.to(socketId).emit('booking-paid', { bookingId });
      this.server.emit('bookingUpdate', {
        bookingId,
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
      });
    } else {
      // Clear timer nếu có
      const timer = this.bookingTimers.get(bookingId);
      if (timer) {
        clearTimeout(timer);
        this.bookingTimers.delete(bookingId);
      }
      this.server.to(socketId).emit('booking-failed', { bookingId });
      this.server.emit('bookingUpdate', {
        bookingId,
        bookingStatus: 'cancel',
        paymentStatus: 'failed',
      });
    }
  }

  @SubscribeMessage('cancel-booking')
  async handleCancelBooking(
    @MessageBody() data: { bookingId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const result = await this.bookingService.cancel(data.bookingId);

      // Clear the timer if it exists
      const timer = this.bookingTimers.get(data.bookingId);
      if (timer) {
        clearTimeout(timer);
        this.bookingTimers.delete(data.bookingId);
      }

      this.server.to(client.id).emit('booking-cancelled', {
        bookingId: data.bookingId,
        refunded: result,
      });

      // Emit bookingUpdate cho toàn bộ client để cập nhật realtime
      this.server.emit('bookingUpdate', {
        bookingId: data.bookingId,
        bookingStatus: 'cancel',
        paymentStatus: 'refunded',
      });
    } catch (error) {
      console.error('Cancel error:', error);
      this.server.to(client.id).emit('booking-error', {
        message: 'Không thể huỷ vé',
      });
    }
  }
}
