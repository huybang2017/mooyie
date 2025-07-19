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
  @ApiProperty({ description: 'Movie title', example: 'Avengers: Endgame' })
  @IsString()
  @Length(1, 100)
  @Transform(({ value }: { value: string }) => value?.trim())
  title: string;

  @ApiProperty({ description: 'Movie genre', example: 'Action' })
  @IsString()
  @Length(1, 50)
  @Transform(({ value }: { value: string }) => value?.trim())
  genre: string;

  @ApiProperty({ description: 'Movie duration (minutes)', example: 120 })
  @IsInt()
  @Min(1)
  @Max(500)
  duration: number;

  @ApiProperty({
    description: 'Movie description',
    example: 'A superhero movie about saving the universe...',
  })
  @IsString()
  @Length(10, 1000)
  @Transform(({ value }: { value: string }) => value?.trim())
  description: string;

  @ApiProperty({
    description: 'Movie poster image',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  image: string;

  @ApiProperty({
    description: 'Movie trailer link (optional)',
    example: 'https://youtube.com/watch?v=abc123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  trailer_url?: string;

  @ApiProperty({
    description: 'Movie status',
    example: 'coming_soon',
    enum: MovieStatus,
    default: MovieStatus.coming_soon,
  })
  @IsOptional()
  @IsEnum(MovieStatus)
  status?: MovieStatus;
}
