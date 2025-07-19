import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationGateway,
  ) {}

  async sendToUser(userId: string, message: string, type: string = 'info') {
    const notification = await this.prisma.notification.create({
      data: { userId, message, type },
    });
    this.gateway.sendNotificationToUser(userId, notification);
    return notification;
  }

  async sendToAll(message: string, type: string = 'info') {
    const users = await this.prisma.user.findMany({ select: { id: true } });
    for (const user of users) {
      const notification = await this.prisma.notification.create({
        data: { userId: user.id, message, type },
      });
      this.gateway.sendNotificationToUser(user.id, notification);
    }
    this.gateway.broadcastNotification({ message, type });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteOldNotifications() {
    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
    const result = await this.prisma.notification.deleteMany({
      where: {
        createdAt: { lt: fifteenDaysAgo },
      },
    });
    if (result.count > 0) {
      console.log(`Deleted ${result.count} notifications older than 15 days.`);
    }
  }
}
