import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('user')
  async sendToUser(
    @Body() body: { userId: string; message: string; type?: string },
  ) {
    return this.notificationService.sendToUser(
      body.userId,
      body.message,
      body.type || 'info',
    );
  }

  @Post('all')
  async sendToAll(@Body() body: { message: string; type?: string }) {
    return this.notificationService.sendToAll(
      body.message,
      body.type || 'info',
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyNotifications(@Req() req) {
    return this.notificationService.getUserNotifications(req.user.id);
  }
}
