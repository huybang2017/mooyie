import {
  IsString,
  IsDateString,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SeatStatus {
  @ApiProperty({ example: 'A' })
  row: string;

  @ApiProperty({ example: 5 })
  number: number;

  @ApiProperty({ example: true })
  isAvailable: boolean;
}

export class CreateShowtimeDto {
  @ApiProperty({ example: '2025-06-26T18:30:00.000Z' })
  @IsDateString()
  time: string;

  @ApiProperty({ type: [SeatStatus] })
  @ValidateNested({ each: true })
  @Type(() => SeatStatus)
  @ArrayNotEmpty()
  seats: SeatStatus[];

  @ApiProperty()
  @IsString()
  movieId: string;

  @ApiProperty()
  @IsString()
  roomId: string;
}
