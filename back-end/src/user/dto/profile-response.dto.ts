import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({ description: 'Unique identifier of the user' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Name of the user' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Email address of the user' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Phone number of the user' })
  @Expose()
  phone: string;

  @ApiProperty({ description: 'Avatar URL of the user' })
  @Expose()
  avatar: string;

  @ApiProperty({ description: 'Date when the user was created' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Role of the user' })
  @Expose()
  role: string;
}
