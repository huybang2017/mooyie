import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiBody({ type: CreateRoomDto })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  create(@Body() dto: CreateRoomDto) {
    return this.roomService.create(dto);
  }

  @Get('/theater/:id')
  @ApiOperation({ summary: 'Get rooms by theater ID' })
  @ApiParam({ name: 'id', description: 'Theater ID' })
  @ApiResponse({ status: 200, description: 'List of rooms for a theater' })
  getByTheater(@Param('id') theaterId: string) {
    return this.roomService.findByTheaterId(theaterId);
  }

  @Get('/:id/seats')
  @ApiOperation({ summary: 'Get seats by room ID' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'List of seats in the room' })
  getSeats(@Param('id') roomId: string) {
    return this.roomService.findSeats(roomId);
  }

  @Get('/showtime/:id')
  @ApiOperation({ summary: 'Get room and seats by showtime ID' })
  @ApiParam({ name: 'id', description: 'Showtime ID' })
  @ApiResponse({ status: 200, description: 'Room with seats for showtime' })
  getShowtimes(@Param('id') showtimeId: string) {
    return this.roomService.findByShowTimeId(showtimeId);
  }
}
