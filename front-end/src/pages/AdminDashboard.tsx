import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchDashboardStatsThunk,
  fetchRevenueChartThunk,
  fetchRecentBookingsThunk,
  fetchRecentCommentsThunk,
  fetchRevenueAnalyticsThunk,
} from "@/store/slices/dashboardSlice";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const {
    stats,
    revenueChart,
    recentBookings,
    recentComments,
    revenueAnalytics,
    loading,
    error,
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStatsThunk());
    dispatch(fetchRevenueChartThunk({ period: "month", months: 12 }));
    dispatch(fetchRecentBookingsThunk({ limit: 5 }));
    dispatch(fetchRecentCommentsThunk({ limit: 5 }));
    dispatch(fetchRevenueAnalyticsThunk());
  }, [dispatch]);

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

  const totalMovies = stats?.totalMovies || 0;
  const totalShowtimes = stats?.totalShowtimes || 0;
  const totalBookings = stats?.totalBookings || 0;
  const totalComments = stats?.totalComments || 0;
  const totalUsers = stats?.totalUsers || 0;
  const totalRevenue = stats?.totalRevenue || 0;

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
      icon: <span className="inline-block w-4 h-4 bg-blue-500 rounded-full" />, 
      growth: movieGrowth,
      description: "Phim đang hoạt động",
    },
    {
      title: "Tổng Lịch Chiếu",
      value: totalShowtimes,
      icon: <span className="inline-block w-4 h-4 bg-green-500 rounded-full" />, 
      growth: showtimeGrowth,
      description: "Lịch chiếu đã lên lịch",
    },
    {
      title: "Vé Đã Bán",
      value: totalBookings,
      icon: <span className="inline-block w-4 h-4 bg-yellow-500 rounded-full" />, 
      growth: bookingGrowth,
      description: "Tổng số đặt vé",
    },
    {
      title: "Tổng Doanh Thu",
      value: `${totalRevenue.toLocaleString()}đ`,
      icon: <span className="inline-block w-4 h-4 bg-purple-500 rounded-full" />, 
      growth: revenueGrowth,
      description: "Tổng doanh thu tạo ra",
    },
    {
      title: "Bình Luận Người Dùng",
      value: totalComments,
      icon: <span className="inline-block w-4 h-4 bg-pink-500 rounded-full" />, 
      growth: commentGrowth,
      description: "Đánh giá và bình luận",
    },
    {
      title: "Người Dùng Đăng Ký",
      value: totalUsers,
      icon: <span className="inline-block w-4 h-4 bg-gray-500 rounded-full" />, 
      growth: userGrowth,
      description: "Tổng người dùng đăng ký",
    },
  ];

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
          <h1 className="text-3xl font-bold tracking-tight">
            Bảng Điều Khiển Admin
          </h1>
          <p className="text-muted-foreground">
            Tổng quan hệ thống quản lý rạp chiếu phim
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Trực tuyến</Badge>
          <span className="text-sm text-muted-foreground">
            Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat, index) => {
          const isPositive = stat.growth > 0;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
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
                  <span
                    className={`text-xs ${
                      isPositive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {stat.growth}%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    so với tháng trước
                  </span>
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
                <CardDescription>Xu hướng doanh thu hàng tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartAreaInteractive
                  data={revenueChart?.data || []}
                  valueKey="revenue"
                  labelKey="month"
                  title="Doanh thu theo tháng"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bán Vé</CardTitle>
                <CardDescription>Xu hướng bán vé hàng tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartAreaInteractive
                  data={revenueChart?.data || []}
                  valueKey="tickets"
                  labelKey="month"
                  title="Số vé bán theo tháng"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân Tích Doanh Thu</CardTitle>
              <CardDescription>Chi tiết doanh thu và xu hướng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {revenueAnalytics?.totalRevenue?.toLocaleString() || 0}đ
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tổng Doanh Thu
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {revenueAnalytics?.averageTicketPrice?.toLocaleString() ||
                      0}
                    đ
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Giá Vé Trung Bình
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {revenueAnalytics?.growthRate || 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tỷ Lệ Tăng Trưởng
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Đặt Vé Gần Đây</CardTitle>
              <CardDescription>Hoạt động đặt vé mới nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings?.data?.length ? (
                  recentBookings.data.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <h4 className="font-medium">{booking.movie.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {booking.user.email} •{" "}
                            {new Date(booking.showtime.dateTime).toLocaleString(
                              "vi-VN"
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Ghế: {booking.seats.join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {booking.amount.toLocaleString()}đ
                        </div>
                        <Badge
                          variant={
                            booking.status === "CONFIRMED"
                              ? "default"
                              : "secondary"
                          }
                          className="mt-1"
                        >
                          {booking.status === "CONFIRMED"
                            ? "Đã xác nhận"
                            : "Đang chờ"}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">
                    Không có dữ liệu đặt vé gần đây.
                  </div>
                )}
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
                {recentComments?.data?.length ? (
                  recentComments.data.map((comment) => (
                    <div key={comment.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{comment.movie.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {comment.user.email} •{" "}
                            {new Date(comment.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                          <p className="text-sm">{comment.comment}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < comment.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">
                    Không có bình luận gần đây.
                  </div>
                )}
                <div className="text-center pt-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {recentComments?.averageRating?.toFixed(1) || "0.0"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Điểm Đánh Giá Trung Bình
                  </p>
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
