import { Controller, Get, Post, Body } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Theaters')
@Controller('theaters')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @Get()
  getAll() {
    return this.theaterService.findAll();
  }

  @Post()
  create(@Body() dto: CreateTheaterDto) {
    return this.theaterService.create(dto);
  }
}
