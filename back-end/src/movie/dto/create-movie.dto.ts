import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max, Length } from 'class-validator';
import { Transform } from 'class-transformer';

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
    example: 'A superhero movie about ...',
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
}
