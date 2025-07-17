import { IsString, IsNumber, IsUUID, Min, Max } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsUUID()
  userId: string;

  @IsUUID()
  movieId: string;
}
