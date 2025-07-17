import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { PaginationTheaterDto } from 'src/theater/dto/pagination-theater.dto';
import { FilterTheaterDto } from 'src/theater/dto/filter-theater.dto';
import { paginate } from 'src/utils/helper/paginate';
import { Prisma } from 'generated/prisma';
import { UpdateBookingDto } from 'src/booking/dto/update-booking.dto';
import { UpdateTheaterDto } from 'src/theater/dto/update-theater.dto';

@Injectable()
export class TheaterService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.theater.findMany({
      include: { rooms: true },
    });
  }

  findAllAdmin(filter: FilterTheaterDto, pagination: PaginationTheaterDto) {
    const { page, limit } = pagination;
    const { name, location, brand, status } = filter;
    const where: Prisma.TheaterWhereInput = {};
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }
    if (brand) {
      where.brand = {
        contains: filter.brand,
        mode: 'insensitive',
      };
    }

    if (status) {
      where.status = status;
    }

    return paginate(this.prisma.theater, {
      where,
      page,
      limit,
      orderBy: { createdAt: 'desc' },
      include: { rooms: true },
    });
  }

  create(dto: CreateTheaterDto) {
    return this.prisma.theater.create({ data: dto });
  }

  update(dto: UpdateTheaterDto, id: string) {
    return this.prisma.theater.update({
      where: { id },
      data: dto,
      include: { rooms: true },
    });
  }
}
