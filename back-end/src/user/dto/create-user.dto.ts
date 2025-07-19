import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (at least 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: '0987654321',
    description: 'User phone number',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'https://i.imgur.com/avatar.jpg',
    description: 'Avatar image link',
  })
  @IsString()
  @IsOptional()
  avatar: string;
}
