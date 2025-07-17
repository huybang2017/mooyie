import {
  Controller,
  UseGuards,
  Get,
  Delete,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'generated/prisma';
import { Roles } from 'src/auth/decorate/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentService } from 'src/comment/comment.service';
import { FilterCommentDto } from 'src/comment/dto/filter-comment.dto';
import { PaginationCommentDto } from 'src/comment/dto/pagination-comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all comments' })
  getAllComments(
    @Query() filter: FilterCommentDto,
    @Query() pagination: PaginationCommentDto,
  ) {
    return this.commentService.findAllAdmin(filter, pagination);
  }

  @Get('rating/:movieId')
  @ApiOperation({ summary: 'Get average rating for a movie' })
  @ApiParam({ name: 'movieId', type: String, description: 'Movie ID' })
  getAverageRating(@Param('movieId') movieId: string) {
    return this.commentService.getAverageRating(movieId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Comment ID' })
  deleteCommentById(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
