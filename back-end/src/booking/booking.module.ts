import { forwardRef, Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingGateway } from 'src/booking/booking.gateway';
import { PaymentModule } from 'src/payment/payment.module';
import { BookingStatusCronService } from './booking-status-cron.service';

@Module({
  imports: [forwardRef(() => PaymentModule)],
  controllers: [BookingController],
  providers: [BookingService, BookingGateway, BookingStatusCronService],
  exports: [BookingService, BookingGateway],
})
export class BookingModule {}
