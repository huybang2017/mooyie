import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FilterShowTimeDto {
  @ApiPropertyOptional({
    description: 'Lọc theo tên phim',
    example: 'Inception',
  })
  @IsOptional()
  @IsString()
  movie?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái chiếu',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Lọc theo thời gian chiếu',
  })
  @IsOptional()
  @IsString()
  time?: string;
}
