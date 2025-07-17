import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { BookingStatus } from 'generated/prisma';

export class FilterBookingDto {
  @ApiPropertyOptional({
    description: 'Filter by customer name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    description: 'Filter by theater name',
    example: 'Cineplex',
  })
  @IsOptional()
  @IsString()
  theaterName?: string;

  @ApiPropertyOptional({
    description: 'Filter by movie name',
    example: 'Inception',
  })
  @IsOptional()
  @IsString()
  movieName?: string;

  @ApiPropertyOptional({
    description: 'Filter by booking status',
    enum: BookingStatus,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
