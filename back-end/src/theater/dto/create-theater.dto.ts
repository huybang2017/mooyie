import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTheaterDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  location: string;
}
