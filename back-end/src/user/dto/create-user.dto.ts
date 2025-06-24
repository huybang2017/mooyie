import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyen Van A', description: 'Tên người dùng' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email người dùng' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu người dùng (ít nhất 6 ký tự)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: '0987654321',
    description: 'Số điện thoại người dùng',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'https://i.imgur.com/avatar.jpg',
    description: 'Link ảnh đại diện',
  })
  @IsString()
  @IsOptional()
  avatar: string;
}
