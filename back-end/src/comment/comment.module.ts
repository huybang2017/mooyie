import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentGateway } from './comment.gateway';
import { CommentController } from 'src/comment/comment.controller';

@Module({
  controllers: [CommentController],
  providers: [CommentGateway, CommentService],
})
export class CommentModule {}
