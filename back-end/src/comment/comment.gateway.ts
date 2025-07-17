import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/comments',
})
export class CommentGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly commentService: CommentService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinMovieRoom')
  async joinMovieRoom(
    @MessageBody() movieId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const room = `movie-${movieId}`;
    client.join(room);
    console.log(`Client ${client.id} joined room: ${room}`);

    try {
      const comments = await this.commentService.findByMovie(movieId);
      client.emit('commentsLoadedSuccess', comments);
    } catch (error) {
      client.emit('commentsLoadedError', {
        message: 'Failed to load comments for movie',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return { message: `Joined room: ${room}` };
  }

  @SubscribeMessage('leaveMovieRoom')
  leaveMovieRoom(
    @MessageBody() movieId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const room = `movie-${movieId}`;
    client.leave(room);
    console.log(`Client ${client.id} left room: ${room}`);
    return { message: `Left room: ${room}` };
  }

  @SubscribeMessage('createComment')
  async create(
    @MessageBody() dto: CreateCommentDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const comment = await this.commentService.create(dto);
      this.broadcastToMovieRoom(dto.movieId, 'commentCreated', comment);
      return comment;
    } catch (error) {
      client.emit('commentError', {
        message: 'Failed to create comment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('findAllComments')
  async findAll(@ConnectedSocket() client: Socket) {
    try {
      const comments = await this.commentService.findAll();
      client.emit('commentsLoadedSuccess', comments);
      return comments;
    } catch (error) {
      client.emit('commentsLoadedError', {
        message: 'Failed to load all comments',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('findCommentsByMovie')
  async findByMovie(
    @MessageBody() movieId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const comments = await this.commentService.findByMovie(movieId);
      client.emit('commentsLoadedSuccess', comments);
      return comments;
    } catch (error) {
      client.emit('commentsLoadedError', {
        message: 'Failed to load movie comments',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('findOneComment')
  async findOne(@MessageBody() id: string, @ConnectedSocket() client: Socket) {
    try {
      const comment = await this.commentService.findOne(id);
      client.emit('commentFoundSuccess', comment);
      return comment;
    } catch (error: unknown) {
      client.emit('commentFoundError', {
        message: 'Failed to find comment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('updateComment')
  async update(
    @MessageBody() dto: UpdateCommentDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const comment = await this.commentService.update(dto.id, dto);
      this.broadcastToMovieRoom(comment.movieId, 'commentUpdated', comment);
      return comment;
    } catch (error) {
      client.emit('commentError', {
        message: 'Failed to update comment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('removeComment')
  async remove(
    @MessageBody() data: { id: string; movieId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.commentService.remove(data.id);
      this.broadcastToMovieRoom(data.movieId, 'commentRemoved', {
        id: data.id,
      });
      return { message: 'Comment removed' };
    } catch (error) {
      client.emit('commentError', {
        message: 'Failed to remove comment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  broadcastToMovieRoom(movieId: string, event: string, data: any) {
    this.server.to(`movie-${movieId}`).emit(event, data);
  }
}
