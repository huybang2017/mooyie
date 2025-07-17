import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterPayloadDto } from './dto/register-payload.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { Request } from 'express';
import { ProfileResponseDto } from 'src/user/dto/profile-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserProfileCacheInterceptor } from './user-profile-cache.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: String,
  })
  async register(@Body() dto: RegisterPayloadDto): Promise<string> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Returns access and refresh tokens',
    type: LoginResponseDto,
  })
  async login(@Body() dto: LoginPayloadDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT tokens' })
  @ApiResponse({
    status: 200,
    description: 'Returns new access token and the same refresh token',
    schema: {
      example: {
        accessToken: 'string',
        refreshToken: 'string',
      },
    },
  })
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshToken(refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserProfileCacheInterceptor)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    type: ProfileResponseDto,
  })
  async getMe(@Req() req: Request): Promise<ProfileResponseDto> {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '').trim();

    if (!token) {
      throw new BadRequestException('Token không hợp lệ hoặc thiếu');
    }

    return this.authService.validateUser(token);
  }
}
