import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterMovieDto } from 'src/movie/dto/filter-movie.dto';
import { PaginationMovieDto } from 'src/movie/dto/pagination-movie.dto';

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMovieDto) {
    return this.prisma.movie.create({ data: dto });
  }

  findAll(filter: FilterMovieDto, pagination: PaginationMovieDto) {
    const { page = 1, limit = 10 } = pagination;
    const where: Record<string, any> = {};

    if (filter.genre) where.genre = filter.genre;
    if (filter.cinemaId) where.cinemaId = filter.cinemaId;

    return this.prisma.movie.findMany({
      where,
      skip: +(page - 1) * +limit,
      take: +limit,
    });
  }

  findOne(id: string) {
    return this.prisma.movie.findUnique({
      where: { id },
      include: {
        showtimes: true,
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
