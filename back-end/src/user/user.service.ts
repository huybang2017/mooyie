import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from 'src/user/dto/change-password.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { BookingStatus, Prisma, User } from 'generated/prisma';
import * as bcrypt from 'bcryptjs';
import { FilterUserDto } from 'src/user/dto/fitler-user.dto';
import { PaginationUserDto } from 'src/user/dto/pagination-user.dto';
import { paginate } from 'src/utils/helper/paginate';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      10 as number,
    );
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        status: true,
        password: hashedPassword,
      },
    });
    return user;
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        status: true,
        createdAt: true,
        role: true,
      },
    });
  }

  findAllAdmin(filter: FilterUserDto, pagination: PaginationUserDto) {
    const { page, limit } = pagination;
    const { name, role, email, status } = filter;

    const where: Prisma.UserWhereInput = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }

    if (role) {
      where.role = role;
    }

    if (typeof status === 'boolean') {
      where.status = status;
    }

    return paginate(this.prisma.user, {
      where,
      page,
      limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        status: true,
        createdAt: true,
        role: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        createdAt: true,
        role: true,
        bookings: {
          include: {
            showtime: {
              include: {
                movie: true,
              },
            },
          },
        },
        bookmarks: {
          include: {
            movie: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Check tồn tại
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async changeStatusAccount(id: string, status: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    if (user.role === 'ADMIN') {
      throw new BadRequestException(
        'Không thể thay đổi trạng thái của tài khoản ADMIN',
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  getWatchHistory(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId, status: BookingStatus.CONFIRMED },
      include: {
        showtime: {
          include: {
            movie: true,
          },
        },
      },
    });
  }

  getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        showtime: {
          include: {
            movie: true,
            room: {
              include: {
                seats: true,
              },
            },
          },
        },
      },
    });
  }

  getUserComments(userId: string) {
    return this.prisma.comment.findMany({
      where: { userId },
      include: { movie: true },
    });
  }

  getUserBookmarks(userId: string) {
    return this.prisma.bookmark.findMany({
      where: { userId },
      include: { movie: true },
    });
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new ForbiddenException('Người dùng không tồn tại');

    const match = await bcrypt.compare(dto.oldPassword, user.password);
    if (!match) throw new ForbiddenException('Mật khẩu cũ không đúng');

    const newHashed: string = await bcrypt.hash(dto.newPassword, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password: newHashed },
    });
  }
}
