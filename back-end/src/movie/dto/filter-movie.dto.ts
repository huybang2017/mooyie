import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterMovieDto {
  @ApiPropertyOptional({ description: 'Lọc theo thể loại', example: 'Action' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo rạp chiếu',
    example: 'cinema-uuid',
  })
  @IsOptional()
  @IsString()
  cinemaId?: string;
}
