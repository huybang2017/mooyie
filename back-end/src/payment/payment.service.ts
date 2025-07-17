import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from './dto/create-payment.dto';
import Stripe from 'stripe';
import { BookingStatus, PaymentStatus } from 'generated/prisma';
import { CreateIntentDto } from 'src/payment/dto/create-intent.dto';
import e, { Request, Response } from 'express';
import { BookingGateway } from 'src/booking/booking.gateway';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    @Inject(forwardRef(() => BookingGateway))
    private bookingGateway: BookingGateway,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Missing STRIPE_SECRET_KEY in environment variables');
    }

    this.stripe = new Stripe(stripeKey);
  }

  async create(dto: CreatePaymentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status === BookingStatus.CANCELED) {
      throw new BadRequestException('Cannot pay for a canceled booking');
    }

    const amount = Math.round(booking.totalPrice * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    const payment = await this.prisma.payment.create({
      data: {
        amount: booking.totalPrice,
        status: PaymentStatus.PAID,
        stripePaymentId: paymentIntent.id,
        bookingId: dto.bookingId,
      },
    });

    return payment;
  }

  async findById(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async createIntent(dto: CreateIntentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status === BookingStatus.CANCELED) {
      throw new BadRequestException('Cannot pay for canceled booking');
    }

    const amount = Math.round(booking.totalPrice * 100);

    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        bookingId: dto.bookingId,
      },
    });

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    };
  }

  async createQrCheckout(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Movie Ticket',
            },
            unit_amount: Math.round(booking.totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${this.configService.get('FRONTEND_URL')}/payment-success?bookingId=${bookingId}`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/payment-failed?bookingId=${bookingId}`,
      metadata: {
        bookingId: bookingId,
      },
      payment_intent_data: {
        metadata: {
          bookingId: bookingId,
        },
      },
    });

    console.log(
      `Created Stripe Checkout session for booking ${bookingId}:`,
      session.id,
    );
    console.log(`Checkout session URL: ${session.url}`);

    return { url: session.url };
  }

  async refund(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (!booking.payment) throw new NotFoundException('Payment not found');

    if (booking.payment.status === PaymentStatus.REFUNDED) {
      throw new BadRequestException('Payment already refunded');
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed bookings can be refunded');
    }

    // Chỉ gọi Stripe nếu là payment_intent thật
    if (booking.payment.stripePaymentId && booking.payment.stripePaymentId.startsWith('pi_')) {
      await this.stripe.refunds.create({
        payment_intent: booking.payment.stripePaymentId,
      });
    }

    await this.prisma.payment.update({
      where: { id: booking.payment.id },
      data: {
        status: PaymentStatus.REFUNDED,
      },
    });

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.CANCELED,
      },
    });

    return {
      message: 'Refund successful',
      bookingId: booking.id,
    };
  }

  async createPendingPayment(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const payment = await this.prisma.payment.create({
      data: {
        amount: booking.totalPrice,
        status: PaymentStatus.PENDING,
        stripePaymentId: `pending_${Date.now()}`,
        bookingId: bookingId,
      },
    });

    return payment;
  }

  async markPaymentAsPaid(bookingId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { bookingId },
    });

    if (!payment) throw new NotFoundException('Payment not found');

    return this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.PAID,
        paidAt: new Date(),
      },
    });
  }

  async markPaymentAsFailed(bookingId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { bookingId },
    });

    if (!payment) throw new NotFoundException('Payment not found');

    return this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.FAILED,
      },
    });
  }

  async handleWebhook(req: Request, res: Response) {
    console.log('--- Stripe Webhook Received ---');
    console.log('Headers:', req.headers);
    console.log('Raw body:', req.body);
    const sig = req.headers['stripe-signature'];
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!endpointSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET');
      return res.status(400).send('Webhook secret not configured');
    }

    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        endpointSecret,
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send('Webhook signature verification failed');
    }

    console.log(`Received event type: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Event: payment_intent.succeeded', paymentIntent);
        await this.handlePaymentSuccess(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Event: payment_intent.payment_failed', failedPayment);
        await this.handlePaymentFailure(failedPayment);
        break;
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Event: checkout.session.completed', session);
        await this.handleCheckoutSessionCompleted(session);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }

  private async handlePaymentSuccess(paymentIntent: any) {
    try {
      const bookingId = paymentIntent.metadata?.bookingId;
      console.log('handlePaymentSuccess - bookingId:', bookingId);
      if (!bookingId) {
        console.error('No booking ID in payment intent metadata');
        return;
      }

      // Update payment status
      await this.markPaymentAsPaid(bookingId);

      // Update booking status
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: { user: true },
      });

      if (booking) {
        await this.prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'CONFIRMED' },
        });

        // Notify user via WebSocket if available
        await this.bookingGateway.notifyPaymentStatus(
          booking.userId,
          'success',
          bookingId,
        );
        console.log(`Payment successful for booking ${bookingId}`);
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
    }
  }

  private async handlePaymentFailure(paymentIntent: any) {
    try {
      const bookingId = paymentIntent.metadata?.bookingId;
      console.log('handlePaymentFailure - bookingId:', bookingId);
      if (!bookingId) {
        console.error('No booking ID in payment intent metadata');
        return;
      }

      // Update payment status
      await this.markPaymentAsFailed(bookingId);

      // Cancel booking and release seats
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: { user: true },
      });

      if (booking) {
        await this.prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'CANCELED' },
        });

        // Release seats
        const seats = booking.seats as string[];
        await this.releaseSeats(booking.showtimeId, seats);

        // Notify user via WebSocket if available
        await this.bookingGateway.notifyPaymentStatus(
          booking.userId,
          'failed',
          bookingId,
        );
        console.log(`Payment failed for booking ${bookingId}`);
      }
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }

  private async handleCheckoutSessionCompleted(session: any) {
    try {
      const bookingId = session.metadata?.bookingId;
      console.log('handleCheckoutSessionCompleted - bookingId:', bookingId);
      if (!bookingId) {
        console.error('No booking ID in session metadata');
        return;
      }

      // Update payment status
      await this.markPaymentAsPaid(bookingId);

      // Update booking status
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      });

      console.log(`Checkout session completed for booking ${bookingId}`);
    } catch (error) {
      console.error('Error handling checkout session completed:', error);
    }
  }

  private async releaseSeats(showtimeId: string, seatsToRelease: string[]) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: showtimeId },
    });

    if (showtime) {
      const currentSeats = (showtime.seats as string[]) ?? [];
      const updatedSeats = currentSeats.filter(
        (seat) => !seatsToRelease.includes(seat),
      );

      await this.prisma.showtime.update({
        where: { id: showtimeId },
        data: { seats: updatedSeats },
      });
    }
  }
}
