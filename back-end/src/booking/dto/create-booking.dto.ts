import { IsUUID, IsNumber, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'ID suất chiếu', example: 'uuid-showtime-id' })
  @IsUUID()
  showtimeId: string;

  @ApiProperty({
    description: 'Danh sách ghế (row + number)',
    example: [{ row: 'A', number: 1 }],
  })
  @IsArray()
  @IsNotEmpty()
  seats: string[];

  @ApiProperty({ description: 'Tổng giá vé', example: 120000 })
  @IsNumber()
  totalPrice: number;
}
