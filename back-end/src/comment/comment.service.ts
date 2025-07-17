import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FilterCommentDto } from 'src/comment/dto/filter-comment.dto';
import { PaginationCommentDto } from 'src/comment/dto/pagination-comment.dto';
import { Prisma } from 'generated/prisma';
import { paginate } from 'src/utils/helper/paginate';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        rating: createCommentDto.rating,
        userId: createCommentDto.userId,
        movieId: createCommentDto.movieId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        movie: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return comment;
  }

  async findAll() {
    return this.prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        movie: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllAdmin(
    filter: FilterCommentDto,
    pagination: PaginationCommentDto,
  ) {
    const { limit, page } = pagination;
    const { user, movie, rating } = filter;
    const where: Prisma.CommentWhereInput = {};
    if (user) {
      where.user = {
        name: { contains: user, mode: 'insensitive' },
      };
    }
    if (movie) {
      where.movie = {
        title: { contains: movie, mode: 'insensitive' },
      };
    }
    if (rating) {
      where.rating = rating;
    }
    return paginate(this.prisma.comment, {
      where,
      page,
      limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            avatar: true,
            role: true,
            status: true,
            createdAt: true,
          },
        },
        movie: true,
      },
    });
  }

  async findByMovie(movieId: string) {
    return this.prisma.comment.findMany({
      where: { movieId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        movie: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        movie: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    await this.findOne(id);

    const comment = await this.prisma.comment.update({
      where: { id },
      data: {
        content: updateCommentDto.content,
        rating: updateCommentDto.rating,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        movie: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return comment;
  }

  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('ID không hợp lệ');
    }

    const comment = await this.prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    const deletedComment = await this.prisma.comment.delete({
      where: { id },
    });

    return deletedComment;
  }

  async getAverageRating(movieId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { movieId },
      select: { rating: true },
    });

    if (comments.length === 0) {
      return 0;
    }

    const totalRating = comments.reduce(
      (sum, comment) => sum + comment.rating,
      0,
    );
    return { averageRating: Math.round(totalRating / comments.length) };
  }
}
