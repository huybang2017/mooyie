import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingService } from './booking.service';

@Injectable()
export class BookingStatusCronService {
  private readonly logger = new Logger(BookingStatusCronService.name);

  constructor(private readonly bookingService: BookingService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async updateExpiredBookings() {
    this.logger.log('Checking for expired bookings...');
    await this.bookingService.handleExpiredBookings();
  }
}
