import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoomDto) {
    const theater = await this.prisma.theater.findUnique({
      where: { id: dto.theaterId },
    });
    if (!theater) throw new NotFoundException('Theater not found');

    return this.prisma.room.create({ data: dto });
  }

  async findByTheaterId(theaterId: string) {
    const theater = await this.prisma.theater.findUnique({
      where: { id: theaterId },
    });
    if (!theater) throw new NotFoundException('Theater not found');

    return this.prisma.room.findMany({ where: { theaterId } });
  }

  async findSeats(roomId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) throw new NotFoundException('Room not found');

    return this.prisma.seat.findMany({ where: { roomId } });
  }
}
