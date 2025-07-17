import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Req,
  Res,
  Header,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateIntentDto } from 'src/payment/dto/create-intent.dto';
import { Request, Response } from 'express';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @Post('webhook')
  @Header('Content-Type', 'application/json')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentService.handleWebhook(req, res);
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

  @Get('/qr-checkout/:bookingId')
  async getQr(@Param('bookingId') bookingId: string) {
    return this.paymentService.createQrCheckout(bookingId);
  }
}
