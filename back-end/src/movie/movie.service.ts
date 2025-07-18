import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterMovieDto } from 'src/movie/dto/filter-movie.dto';
import { PaginationMovieDto } from 'src/movie/dto/pagination-movie.dto';
import { Prisma } from 'generated/prisma';
import { paginate } from 'src/utils/helper/paginate';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class MovieService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {}

  async create(dto: CreateMovieDto) {
    const movie = await this.prisma.movie.create({ data: dto });
    // Send real-time notification to all users
    await this.notificationService.sendToAll(
      `A new movie "${movie.title}" is now available!`,
      'new_movie',
    );
    return movie;
  }

  async findAll(filter: FilterMovieDto, pagination: PaginationMovieDto) {
    const { page = 1, limit = 10 } = pagination;
    const { genre, title, status } = filter;

    const where: Prisma.MovieWhereInput = {};
    if (genre) {
      where.genre = {
        contains: genre,
        mode: 'insensitive',
      };
    }

    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    if (status) {
      where.status = status;
    }

    return paginate(this.prisma.movie, {
      where,
      page,
      limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllAdmin(filter: FilterMovieDto, pagination: PaginationMovieDto) {
    const { page, limit } = pagination;
    const { genre, title, status } = filter;

    const where: Prisma.MovieWhereInput = {};

    if (genre) {
      where.genre = {
        contains: genre,
        mode: 'insensitive',
      };
    }

    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    if (status) {
      where.status = status;
    }

    return paginate(this.prisma.movie, {
      where,
      page,
      limit,
      orderBy: { createdAt: 'desc' },
      include: {
        showtimes: {
          include: {
            bookings: true,
            room: { include: { theater: true } },
          },
        },
        comments: true,
        bookmarks: { include: { user: true } },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.movie.findUnique({
      where: { id },
      include: {
        showtimes: {
          include: { room: { include: { theater: true } } },
        },
        comments: true,
        bookmarks: true,
      },
    });
  }

  update(id: string, dto: UpdateMovieDto) {
    return this.prisma.movie.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.movie.update({
      where: { id },
      data: { status: 'ended' },
    });
  }
}
