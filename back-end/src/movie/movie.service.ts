import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterMovieDto } from 'src/movie/dto/filter-movie.dto';
import { PaginationMovieDto } from 'src/movie/dto/pagination-movie.dto';
import { Prisma } from 'generated/prisma';
import { paginate } from 'src/utils/helper/paginate';

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMovieDto) {
    return this.prisma.movie.create({ data: dto });
  }

  async findAll(filter: FilterMovieDto, pagination: PaginationMovieDto) {
    const { page = 1, limit = 10 } = pagination;

    const where: Prisma.MovieWhereInput = {};
    if (filter.genre) where.genre = filter.genre;

    return paginate(this.prisma.movie, {
      where,
      page,
      limit,
      orderBy: { createdAt: 'desc' },
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

  remove(id: string) {
    return this.prisma.movie.delete({ where: { id } });
  }
}
