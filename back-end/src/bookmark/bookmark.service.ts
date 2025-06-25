import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookmarkDto) {
    const existing = await this.prisma.bookmark.findFirst({
      where: { userId, movieId: dto.movieId },
    });

    if (existing) {
      throw new ForbiddenException('Phim đã có trong bookmark');
    }

    return this.prisma.bookmark.create({
      data: {
        userId,
        movieId: dto.movieId,
      },
    });
  }

  async remove(userId: string, movieId: string) {
    const existing = await this.prisma.bookmark.findFirst({
      where: { userId, movieId },
    });

    if (!existing) {
      throw new ForbiddenException('Phim không có trong bookmark');
    }

    return this.prisma.bookmark.delete({
      where: { id: existing.id },
    });
  }
}
