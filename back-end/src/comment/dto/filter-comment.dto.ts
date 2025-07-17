import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator';

export class FilterCommentDto {
  @ApiPropertyOptional({ description: 'Filter by user name', example: 'John' })
  @IsOptional()
  @IsString()
  user?: string;

  @ApiPropertyOptional({
    description: 'Filter by movie name',
    example: 'Endgame',
  })
  @IsOptional()
  @IsString()
  movie?: string;

  @ApiPropertyOptional({
    description: 'Filter by content rating',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsIn([1, 2, 3, 4, 5])
  rating?: number;
}
