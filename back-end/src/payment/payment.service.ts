import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from './dto/create-payment.dto';
import Stripe from 'stripe';
import { BookingStatus, PaymentStatus } from 'generated/prisma';
import { CreateIntentDto } from 'src/payment/dto/create-intent.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Missing STRIPE_SECRET_KEY in environment variables');
    }

    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2024-11-20.acacia' as any,
    });
  }

  async create(dto: CreatePaymentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status === BookingStatus.CANCELED) {
      throw new BadRequestException('Cannot pay for a canceled booking');
    }
    if (booking.status === BookingStatus.REFUNDED) {
      throw new BadRequestException('This booking has already been refunded');
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

  async refund(bookingId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { bookingId },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status === PaymentStatus.REFUNDED) {
      throw new BadRequestException('Already refunded');
    }

    await this.stripe.refunds.create({
      payment_intent: payment.stripePaymentId,
    });

    return this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.REFUNDED,
      },
    });
  }

  async createIntent(dto: CreateIntentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status === BookingStatus.CANCELED) {
      throw new BadRequestException('Cannot pay for canceled booking');
    }
    if (booking.status === BookingStatus.REFUNDED) {
      throw new BadRequestException('Booking already refunded');
    }

    const amount = Math.round(booking.totalPrice * 100);

    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    };
  }
}
