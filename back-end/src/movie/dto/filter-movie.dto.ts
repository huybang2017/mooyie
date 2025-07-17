import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterMovieDto {
  @ApiPropertyOptional({ description: 'Lọc theo thể loại', example: 'Action' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo tên phim',
    example: 'Inception',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái phim',
    example: 'now_showing',
  })
  @IsOptional()
  @IsString()
  status?: 'coming_soon' | 'now_showing' | 'ended';
}
