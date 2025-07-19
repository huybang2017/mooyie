import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterMovieDto {
  @ApiPropertyOptional({ description: 'Filter by genre', example: 'Action' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({
    description: 'Filter by movie title',
    example: 'Inception',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by movie status',
    example: 'now_showing',
  })
  @IsOptional()
  @IsString()
  status?: 'coming_soon' | 'now_showing' | 'ended';
}
