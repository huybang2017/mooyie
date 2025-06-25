import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ShowtimeService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.showtime.findMany({
      include: { movie: true, room: true },
    });
  }

  findByMovieId(movieId: string) {
    return this.prisma.showtime.findMany({
      where: { movieId },
      include: { room: true },
    });
  }

  async create(dto: CreateShowtimeDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: dto.movieId },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with id ${dto.movieId} not found`);
    }

    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
    });
    if (!room) {
      throw new NotFoundException(`Room with id ${dto.roomId} not found`);
    }

    return this.prisma.showtime.create({
      data: {
        time: new Date(dto.time),
        seats: JSON.parse(JSON.stringify(dto.seats)) as Prisma.InputJsonValue,
        movieId: dto.movieId,
        roomId: dto.roomId,
      },
    });
  }

  async update(id: string, dto: UpdateShowtimeDto) {
    const showtime = await this.prisma.showtime.findUnique({ where: { id } });
    if (!showtime) {
      throw new NotFoundException(`Showtime with id ${id} not found`);
    }

    const data: Partial<Prisma.ShowtimeUpdateInput> = {};

    if (dto.time) {
      data.time = new Date(dto.time);
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

    return this.prisma.showtime.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.showtime.delete({ where: { id } });
  }
}
