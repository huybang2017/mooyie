import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  Min,
  Max,
  Length,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { MovieStatus } from 'generated/prisma';

export class CreateMovieDto {
  @ApiProperty({ description: 'Tên phim', example: 'Avengers: Endgame' })
  @IsString()
  @Length(1, 100)
  @Transform(({ value }: { value: string }) => value?.trim())
  title: string;

  @ApiProperty({ description: 'Thể loại phim', example: 'Action' })
  @IsString()
  @Length(1, 50)
  @Transform(({ value }: { value: string }) => value?.trim())
  genre: string;

  @ApiProperty({ description: 'Thời lượng phim (phút)', example: 120 })
  @IsInt()
  @Min(1)
  @Max(500)
  duration: number;

  @ApiProperty({
    description: 'Mô tả phim',
    example: 'A superhero movie about saving the universe...',
  })
  @IsString()
  @Length(10, 1000)
  @Transform(({ value }: { value: string }) => value?.trim())
  description: string;

  @ApiProperty({
    description: 'Ảnh đại diện phim',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  image: string;

  @ApiProperty({
    description: 'Link trailer phim (tùy chọn)',
    example: 'https://youtube.com/watch?v=abc123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  trailer_url?: string;

  @ApiProperty({
    description: 'Trạng thái phim',
    example: 'coming_soon',
    enum: MovieStatus,
    default: MovieStatus.coming_soon,
  })
  @IsOptional()
  @IsEnum(MovieStatus)
  status?: MovieStatus;
}
