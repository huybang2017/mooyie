import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateShowtimeDto } from './create-showtime.dto';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SeatStatus {
  @ApiProperty({ example: 'A' })
  @IsString()
  row: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  number: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isAvailable: boolean;
}

export class UpdateShowtimeDto extends PartialType(CreateShowtimeDto) {
  @ApiProperty({ type: [SeatStatus], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SeatStatus)
  seats?: SeatStatus[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
