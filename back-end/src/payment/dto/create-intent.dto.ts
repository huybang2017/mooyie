import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateIntentDto {
  @ApiProperty()
  @IsString()
  bookingId: string;
}
