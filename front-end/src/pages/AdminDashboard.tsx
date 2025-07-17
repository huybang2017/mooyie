import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Film, 
  Calendar, 
  Ticket, 
  DollarSign, 
  MessageSquare, 
  Users, 
  TrendingUp,
  TrendingDown,
  Eye,
  Star
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDashboardStatsThunk } from "@/store/slices/dashboardSlice";
import { DataTable } from "@/components/data-table";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

// Mock data for charts and recent activities
const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 2000 },
  { name: "Apr", revenue: 2780 },
  { name: "May", revenue: 1890 },
  { name: "Jun", revenue: 2390 },
  { name: "Jul", revenue: 3490 },
];

const ticketSalesData = [
  { name: "Jan", tickets: 400 },
  { name: "Feb", tickets: 300 },
  { name: "Mar", tickets: 200 },
  { name: "Apr", revenue: 278 },
  { name: "May", revenue: 189 },
  { name: "Jun", revenue: 239 },
  { name: "Jul", revenue: 349 },
];

const recentBookings = [
  {
    id: 1,
    movie: "Avengers: Endgame",
    user: "john.doe@example.com",
    showtime: "2024-01-15 19:00",
    seats: "A1, A2",
    status: "confirmed",
    amount: 25.00,
  },
  {
    id: 2,
    movie: "Spider-Man: No Way Home",
    user: "jane.smith@example.com",
    showtime: "2024-01-15 20:30",
    seats: "B5",
    status: "confirmed",
    amount: 12.50,
  },
  {
    id: 3,
    movie: "Black Panther: Wakanda Forever",
    user: "mike.wilson@example.com",
    showtime: "2024-01-16 18:00",
    seats: "C3, C4, C5",
    status: "pending",
    amount: 37.50,
  },
];

const recentComments = [
  {
    id: 1,
    user: "alice.johnson@example.com",
    movie: "Avatar: The Way of Water",
    comment: "Amazing visual effects! The 3D experience was incredible.",
    rating: 5,
    date: "2024-01-14",
  },
  {
    id: 2,
    user: "bob.chen@example.com",
    movie: "Top Gun: Maverick",
    comment: "Great action sequences and Tom Cruise was fantastic!",
    rating: 4,
    date: "2024-01-13",
  },
  {
    id: 3,
    user: "sarah.davis@example.com",
    movie: "The Batman",
    comment: "Dark and atmospheric, perfect for the character.",
    rating: 4,
    date: "2024-01-12",
  },
];

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStatsThunk());
  }, [dispatch]);

  // Calculate statistics from API data
  const totalMovies = stats?.totalMovies || 0;
  const totalShowtimes = stats?.totalShowtimes || 0;
  const totalBookings = stats?.totalBookings || 0;
  const totalComments = stats?.totalComments || 0;
  const totalUsers = stats?.totalUsers || 0;
  const totalRevenue = stats?.totalRevenue || 0;

  // Calculate growth percentages from API data
  const movieGrowth = stats?.movieGrowth || 0;
  const showtimeGrowth = stats?.showtimeGrowth || 0;
  const bookingGrowth = stats?.bookingGrowth || 0;
  const revenueGrowth = stats?.revenueGrowth || 0;
  const commentGrowth = stats?.commentGrowth || 0;
  const userGrowth = stats?.userGrowth || 0;

  const statsCards = [
    {
      title: "Tổng Số Phim",
      value: totalMovies,
      icon: Film,
      growth: movieGrowth,
      description: "Phim đang hoạt động",
    },
    {
      title: "Tổng Lịch Chiếu",
      value: totalShowtimes,
      icon: Calendar,
      growth: bookingGrowth,
      description: "Lịch chiếu đã lên lịch",
    },
    {
      title: "Vé Đã Bán",
      value: totalBookings,
      icon: Ticket,
      growth: bookingGrowth,
      description: "Tổng số đặt vé",
    },
    {
      title: "Tổng Doanh Thu",
      value: `${totalRevenue.toFixed(0)}đ`,
      icon: DollarSign,
      growth: revenueGrowth,
      description: "Tổng doanh thu tạo ra",
    },
    {
      title: "Bình Luận Người Dùng",
      value: totalComments,
      icon: MessageSquare,
      growth: userGrowth,
      description: "Đánh giá và bình luận",
    },
    {
      title: "Người Dùng Đăng Ký",
      value: totalUsers,
      icon: Users,
      growth: userGrowth,
      description: "Tổng người dùng đăng ký",
    },
  ];

  if (loading && !stats) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 dark:border-green-400"></div>
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              Đang tải...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 dark:border-green-400"></div>
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              Đang tải...
            </span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bảng Điều Khiển Admin</h1>
          <p className="text-muted-foreground">
            Tổng quan hệ thống quản lý rạp chiếu phim
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Trực tuyến</Badge>
          <span className="text-sm text-muted-foreground">Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.growth > 0;
          
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className="flex items-center mt-2">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{stat.growth}%
                  </span>
                                     <span className="text-xs text-muted-foreground ml-1">so với tháng trước</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
          <TabsTrigger value="revenue">Doanh Thu</TabsTrigger>
          <TabsTrigger value="bookings">Đặt Vé Gần Đây</TabsTrigger>
          <TabsTrigger value="comments">Bình Luận Gần Đây</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
                        <Card>
              <CardHeader>
                <CardTitle>Tổng Quan Doanh Thu</CardTitle>
                <CardDescription>
                  Xu hướng doanh thu hàng tháng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartAreaInteractive />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bán Vé</CardTitle>
                <CardDescription>
                  Xu hướng bán vé hàng tháng
                </CardDescription>
              </CardHeader>
              <CardContent>
            <ChartAreaInteractive />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân Tích Doanh Thu</CardTitle>
              <CardDescription>
                Chi tiết doanh thu và xu hướng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {totalRevenue.toFixed(0)}đ
                  </div>
                  <p className="text-sm text-muted-foreground">Tổng Doanh Thu</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(totalRevenue / totalBookings).toFixed(0)}đ
                  </div>
                  <p className="text-sm text-muted-foreground">Giá Vé Trung Bình</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {revenueGrowth}%
                  </div>
                  <p className="text-sm text-muted-foreground">Tỷ Lệ Tăng Trưởng</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Đặt Vé Gần Đây</CardTitle>
              <CardDescription>
                Hoạt động đặt vé mới nhất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <h4 className="font-medium">{booking.movie}</h4>
                        <p className="text-sm text-muted-foreground">
                          {booking.user} • {booking.showtime}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ghế: {booking.seats}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{booking.amount.toFixed(0)}đ</div>
                      <Badge 
                        variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {booking.status === 'confirmed' ? 'Đã xác nhận' : 'Đang chờ'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bình Luận Gần Đây</CardTitle>
              <CardDescription>
                Đánh giá và phản hồi mới nhất từ người dùng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentComments.map((comment) => (
                  <div key={comment.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{comment.movie}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {comment.user} • {comment.date}
                        </p>
                        <p className="text-sm">{comment.comment}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
          </div>
        </div>
      </div>
                ))}
                <div className="text-center pt-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {recentComments.length > 0 
                      ? (recentComments.reduce((sum, comment) => sum + comment.rating, 0) / recentComments.length).toFixed(1)
                      : '0.0'
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">Điểm Đánh Giá Trung Bình</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


    </div>
  );
};

export default AdminDashboard;
