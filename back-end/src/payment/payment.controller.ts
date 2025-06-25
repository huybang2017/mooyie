import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateIntentDto } from 'src/payment/dto/create-intent.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.paymentService.findById(id);
  }

  @Post('refund/:bookingId')
  refund(@Param('bookingId') bookingId: string) {
    return this.paymentService.refund(bookingId);
  }

  @Post('intent')
  createIntent(@Body() dto: CreateIntentDto) {
    return this.paymentService.createIntent(dto);
  }
}
