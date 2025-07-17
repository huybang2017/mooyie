import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorate/roles.decorator';
import { Role } from 'generated/prisma';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getDashboardStats() {
    return this.dashboardService.getDashboardStats();
  }

  @Get('revenue')
  async getRevenueChart(
    @Query('period') period: string = 'monthly',
    @Query('months') months: number = 6,
  ) {
    return this.dashboardService.getRevenueChart(period, months);
  }

  @Get('recent-bookings')
  async getRecentBookings(@Query('limit') limit: number = 10) {
    return this.dashboardService.getRecentBookings(limit);
  }

  @Get('recent-comments')
  async getRecentComments(@Query('limit') limit: number = 10) {
    return this.dashboardService.getRecentComments(limit);
  }

  @Get('revenue-analytics')
  async getRevenueAnalytics() {
    return this.dashboardService.getRevenueAnalytics();
  }
}
