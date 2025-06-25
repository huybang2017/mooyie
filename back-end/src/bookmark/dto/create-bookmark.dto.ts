import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDto {
  @ApiProperty({ description: 'ID của phim', example: 'uuid-movie-id' })
  @IsUUID()
  movieId: string;
}
