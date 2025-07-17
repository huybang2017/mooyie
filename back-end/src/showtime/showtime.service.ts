import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { FilterShowTimeDto } from 'src/showtime/dto/fitler-showtime.dto';
import { PaginationShowtimeDto } from 'src/showtime/dto/pagination-showitme.dto';
import { paginate } from 'src/utils/helper/paginate';
import { FilterShowTimeByMovieDto } from 'src/showtime/dto/filter-showtime-movie.dto';

@Injectable()
export class ShowtimeService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.showtime.findMany({
      include: { movie: true, room: true },
    });
  }

  findAllAdmin(filter: FilterShowTimeDto, pagination: PaginationShowtimeDto) {
    const { page = 1, limit = 10 } = pagination;
    const { movie, isActive, time } = filter;

    const where: Prisma.ShowtimeWhereInput = {};

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (time) {
      where.time = {
        equals: time,
      };
    }

    if (movie) {
      where.movie = {
        title: {
          contains: movie,
          mode: 'insensitive',
        },
      };
    }

    console.log({ where, page, limit });

    return paginate(this.prisma.showtime, {
      where,
      page,
      limit,
      orderBy: { createdAt: 'desc' },
      include: {
        movie: true,
        room: {
          include: {
            theater: true,
            seats: true,
          },
        },
      },
    });
  }

  findByMovieId(movieId: string, filter: FilterShowTimeByMovieDto) {
    if (!movieId) {
      throw new NotFoundException('Movie ID is required');
    }

    const { theaterLogo, time } = filter;
    const where: Prisma.ShowtimeWhereInput = {};

    if (theaterLogo) {
      where.room = {
        theater: {
          brand: {
            contains: theaterLogo,
            mode: 'insensitive',
          },
        },
      };
    }
    if (time) {
      where.time = {
        equals: time,
      };
    }

    return paginate(this.prisma.showtime, {
      where: { movieId, ...where },
      orderBy: { createdAt: 'desc' },
      include: {
        room: {
          include: {
            theater: true,
          },
        },
      },
    });
  }

  async create(dto: CreateShowtimeDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: dto.movieId },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with id ${dto.movieId} not found`);
    }

    const timeList =
      Array.isArray(dto.startTimes) && dto.startTimes.length > 0
        ? dto.startTimes.map((startStr) => {
            const start = new Date(startStr);
            const end = new Date(start.getTime() + movie.duration * 60000);
            return {
              start: start.toISOString(),
              end: end.toISOString(),
            };
          })
        : [];

    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
    });
    if (!room) {
      throw new NotFoundException(`Room with id ${dto.roomId} not found`);
    }

    return this.prisma.showtime.create({
      data: {
        time: timeList,
        seats: [],
        movieId: dto.movieId,
        isActive: true,
        roomId: dto.roomId,
      },
    });
  }

  async update(id: string, dto: UpdateShowtimeDto) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id },
      include: { movie: true },
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with id ${id} not found`);
    }

    const data: Partial<Prisma.ShowtimeUpdateInput> = {};

    if (dto.startTimes && dto.startTimes.length > 0) {
      let duration = showtime.movie.duration;

      if (dto.movieId && dto.movieId !== showtime.movieId) {
        const newMovie = await this.prisma.movie.findUnique({
          where: { id: dto.movieId },
        });
        if (!newMovie) {
          throw new NotFoundException(`Movie with id ${dto.movieId} not found`);
        }
        duration = newMovie.duration;
      }

      const timeList =
        Array.isArray(dto.startTimes) && dto.startTimes.length > 0
          ? dto.startTimes.map((startStr) => {
              const start = new Date(startStr);
              const end = new Date(start.getTime() + duration * 60 * 1000);
              return {
                start: start.toISOString(),
                end: end.toISOString(),
              };
            })
          : [];

      data.time = timeList as Prisma.InputJsonValue;
    }

    if (dto.seats) {
      data.seats = JSON.parse(
        JSON.stringify(dto.seats),
      ) as Prisma.InputJsonValue;
    }

    if (dto.movieId) {
      const movie = await this.prisma.movie.findUnique({
        where: { id: dto.movieId },
      });
      if (!movie) {
        throw new NotFoundException(`Movie with id ${dto.movieId} not found`);
      }
      data.movie = { connect: { id: dto.movieId } };
    }

    if (dto.roomId) {
      const room = await this.prisma.room.findUnique({
        where: { id: dto.roomId },
      });
      if (!room) {
        throw new NotFoundException(`Room with id ${dto.roomId} not found`);
      }
      data.room = { connect: { id: dto.roomId } };
    }

    if (typeof dto.isActive === 'boolean') {
      data.isActive = dto.isActive;
    }

    return this.prisma.showtime.update({
      where: { id },
      data,
    });
  }

  async getShowtimeWithSeatStatus(id: string) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id },
      include: {
        movie: true,
        room: true,
      },
    });
    if (!showtime) throw new NotFoundException('Showtime not found');

    // Expire all PENDING bookings that have expireAt < now
    const now = new Date();
    await this.prisma.booking.updateMany({
      where: {
        showtimeId: id,
        status: 'PENDING',
        expireAt: { lt: now },
      },
      data: { status: 'EXPIRED' },
    });

    // Get all bookings for this showtime
    const bookings = await this.prisma.booking.findMany({
      where: { showtimeId: id },
      select: { seats: true, status: true, expireAt: true },
    });

    function seatToId(s: any) {
      return typeof s === 'string' ? s : (s.row && s.number ? `${s.row}${s.number}` : String(s.id || s));
    }

    const bookedSeats: string[] = [];
    const pendingSeats: string[] = [];
    for (const b of bookings) {
      if (b.status === 'CONFIRMED') {
        bookedSeats.push(...((b.seats as any[]) || []).map(seatToId));
      } else if (b.status === 'PENDING' && b.expireAt && b.expireAt > now) {
        pendingSeats.push(...((b.seats as any[]) || []).map(seatToId));
      }
    }

    return {
      ...showtime,
      bookedSeats,
      pendingSeats,
    };
  }

  remove(id: string) {
    return this.prisma.showtime.delete({ where: { id } });
  }
}
