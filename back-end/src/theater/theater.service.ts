import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTheaterDto } from './dto/create-theater.dto';

@Injectable()
export class TheaterService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.theater.findMany({
      include: { rooms: true },
    });
  }

  create(dto: CreateTheaterDto) {
    return this.prisma.theater.create({ data: dto });
  }
}
