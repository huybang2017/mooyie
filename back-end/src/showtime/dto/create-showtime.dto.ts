import {
  IsString,
  IsDateString,
  ArrayNotEmpty,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShowtimeDto {
  @ApiProperty({
    example: ['2025-06-26T18:30:00.000Z', '2025-06-27T14:00:00.000Z'],
    type: [String],
    description: 'Danh sách thời gian bắt đầu chiếu phim (ISO string)',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsArray()
  @IsDateString({}, { each: true })
  startTimes: string[];

  @ApiProperty()
  @IsString()
  movieId: string;

  @ApiProperty()
  @IsString()
  roomId: string;
}
