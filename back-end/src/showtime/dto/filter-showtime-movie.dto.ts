import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterShowTimeByMovieDto {
  @ApiPropertyOptional({
    description: 'Lọc theo rạp',
    example: 'CGV',
  })
  @IsOptional()
  @IsString()
  theaterLogo?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo thời gian chiếu',
  })
  @IsOptional()
  @IsString()
  time?: string;
}
