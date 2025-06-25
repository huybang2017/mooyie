import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() dto: CreateRoomDto) {
    return this.roomService.create(dto);
  }

  @Get('/theater/:id')
  getByTheater(@Param('id') theaterId: string) {
    return this.roomService.findByTheaterId(theaterId);
  }

  @Get('/:id/seats')
  getSeats(@Param('id') roomId: string) {
    return this.roomService.findSeats(roomId);
  }
}
