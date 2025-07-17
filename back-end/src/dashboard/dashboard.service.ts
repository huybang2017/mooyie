import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalMovies,
      totalShowtimes,
      totalBookings,
      totalRevenue,
      totalComments,
      totalUsers,
    ] = await Promise.all([
      this.prisma.movie.count(),
      this.prisma.showtime.count(),
      this.prisma.booking.count(),
      this.prisma.booking.aggregate({
        _sum: { totalPrice: true },
      }),
      this.prisma.comment.count(),
      this.prisma.user.count(),
    ]);

    const [
      lastMonthMovies,
      lastMonthShowtimes,
      lastMonthBookings,
      lastMonthRevenue,
      lastMonthComments,
      lastMonthUsers,
    ] = await Promise.all([
      this.prisma.movie.count({
        where: { createdAt: { lt: thisMonth } },
      }),
      this.prisma.showtime.count({
        where: { createdAt: { lt: thisMonth } },
      }),
      this.prisma.booking.count({
        where: { createdAt: { lt: thisMonth } },
      }),
      this.prisma.booking.aggregate({
        where: { createdAt: { lt: thisMonth } },
        _sum: { totalPrice: true },
      }),
      this.prisma.comment.count({
        where: { createdAt: { lt: thisMonth } },
      }),
      this.prisma.user.count({
        where: { createdAt: { lt: thisMonth } },
      }),
    ]);

    // Tính tỷ lệ tăng trưởng
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      totalMovies,
      totalShowtimes,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      totalComments,
      totalUsers,
      movieGrowth: calculateGrowth(totalMovies, lastMonthMovies),
      showtimeGrowth: calculateGrowth(totalShowtimes, lastMonthShowtimes),
      bookingGrowth: calculateGrowth(totalBookings, lastMonthBookings),
      revenueGrowth: calculateGrowth(
        totalRevenue._sum.totalPrice || 0,
        lastMonthRevenue._sum.totalPrice || 0,
      ),
      commentGrowth: calculateGrowth(totalComments, lastMonthComments),
      userGrowth: calculateGrowth(totalUsers, lastMonthUsers),
    };
  }

  async getRevenueChart(period: string = 'monthly', months: number = 6) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const bookings = await this.prisma.booking.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: 'CONFIRMED',
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
    });

    const monthlyData = new Map<string, { revenue: number; tickets: number }>();
    bookings.forEach((booking) => {
      const month = booking.createdAt.toISOString().slice(0, 7);
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { revenue: 0, tickets: 0 });
      }
      const monthStats = monthlyData.get(month);
      if (monthStats) {
        monthStats.revenue += booking.totalPrice;
        monthStats.tickets += 1;
      }
    });

    const data = Array.from(monthlyData.entries())
      .map(([month, stats]) => ({
        month,
        revenue: stats.revenue,
        tickets: stats.tickets,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return { data };
  }

  async getRecentBookings(limit: number = 10) {
    const bookings = await this.prisma.booking.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        showtime: {
          include: {
            movie: {
              select: {
                id: true,
                title: true,
              },
            },
            room: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      data: bookings.map((booking) => ({
        id: booking.id,
        movie: {
          id: booking.showtime.movie.id,
          title: booking.showtime.movie.title,
        },
        user: {
          id: booking.user.id,
          email: booking.user.email,
          name: booking.user.name,
        },
        showtime: {
          id: booking.showtime.id,
          dateTime: booking.showtime.time,
          room: booking.showtime.room
            ? {
                id: booking.showtime.room.id,
                name: booking.showtime.room.name,
              }
            : null,
        },
        seats: booking.seats as string[],
        status: booking.status,
        amount: booking.totalPrice,
        createdAt: booking.createdAt.toISOString(),
      })),
    };
  }

  async getRecentComments(limit: number = 10) {
    const comments = await this.prisma.comment.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
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

    // Tính điểm đánh giá trung bình
    const averageRating =
      comments.length > 0
        ? comments.reduce((sum, comment) => sum + comment.rating, 0) /
          comments.length
        : 0;

    return {
      data: comments.map((comment) => ({
        id: comment.id,
        user: {
          id: comment.user.id,
          email: comment.user.email,
          name: comment.user.name,
        },
        movie: {
          id: comment.movie.id,
          title: comment.movie.title,
        },
        comment: comment.content,
        rating: comment.rating,
        createdAt: comment.createdAt.toISOString(),
      })),
      averageRating,
    };
  }

  async getRevenueAnalytics() {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalRevenue, totalBookings, lastMonthRevenue] = await Promise.all([
      this.prisma.booking.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: { totalPrice: true },
      }),
      this.prisma.booking.count({
        where: { status: 'CONFIRMED' },
      }),
      this.prisma.booking.aggregate({
        where: {
          status: 'CONFIRMED',
          createdAt: { lt: thisMonth },
        },
        _sum: { totalPrice: true },
      }),
      this.prisma.booking.count({
        where: {
          status: 'CONFIRMED',
          createdAt: { lt: thisMonth },
        },
      }),
    ]);

    const currentRevenue = totalRevenue._sum.totalPrice || 0;
    const currentBookings = totalBookings;
    const previousRevenue = lastMonthRevenue._sum.totalPrice || 0;

    const averageTicketPrice =
      currentBookings > 0 ? currentRevenue / currentBookings : 0;
    const growthRate =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    return {
      totalRevenue: currentRevenue,
      averageTicketPrice,
      growthRate,
      totalBookings: currentBookings,
    };
  }
}
