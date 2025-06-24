import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: 'access.token.jwt.here',
    description: 'Access token dùng để xác thực',
  })
  @Expose()
  accessToken: string;

  @ApiProperty({
    example: 'refresh.token.jwt.here',
    description: 'Refresh token dùng để làm mới access token',
  })
  @Expose()
  refreshToken: string;
}
