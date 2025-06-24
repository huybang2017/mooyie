import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { UserService } from 'src/user/user.service';
import { LoginResponseDto } from 'src/auth/dto/login-response.dto';
import { LoginPayloadDto } from 'src/auth/dto/login-payload.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { RegisterPayloadDto } from 'src/auth/dto/register-payload.dto';
import { ProfileResponseDto } from 'src/user/dto/profile-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(token: string): Promise<ProfileResponseDto> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      if (!payload?.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return plainToClass(ProfileResponseDto, user);
    } catch (error) {
      throw new UnauthorizedException(error || 'Invalid token');
    }
  }

  async login(loginDto: LoginPayloadDto): Promise<LoginResponseDto> {
    const user = await this.userService.findUserByEmail(loginDto.email);

    if (!user) {
      throw new ForbiddenException('Email không tồn tại.');
    }

    const isPasswordValid = await compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Mật khẩu không đúng.');
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return plainToClass(LoginResponseDto, {
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  async register(registerDto: RegisterPayloadDto): Promise<string> {
    const existingUser = await this.userService.findUserByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new ForbiddenException('Email already exists');
    }

    const user = await this.userService.create(registerDto);

    return 'User registered successfully with ID: ' + user.id;
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(refreshToken);
      const user = await this.userService.findUserByEmail(decoded.email);

      if (!user) {
        throw new ForbiddenException('User not found');
      }

      const payload: JwtPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };

      return {
        accessToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
        refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException(error || 'Invalid refresh token');
    }
  }
}
