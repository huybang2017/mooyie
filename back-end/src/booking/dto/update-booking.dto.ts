import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BookingStatus } from 'generated/prisma';

export class UpdateBookingDto {
  @ApiProperty({ description: 'The status of the booking', required: false })
  @IsString()
  status: BookingStatus;
}
