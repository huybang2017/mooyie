import { useEffect, useState } from "react";
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

const getSeatString = (seats: any) => {
  let seatList: any[] = [];
  try {
    seatList = Array.isArray(seats)
      ? seats
      : typeof seats === "string"
      ? JSON.parse(seats)
      : [];
  } catch {
    seatList = [];
  }
  return seatList.length
    ? seatList.map((s) => `${s.row ?? "?"}${s.number ?? "?"}`).join(", ")
    : "N/A";
};

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

  const [statsCards, setStatsCards] = useState([
    {
      title: "Total Movies",
      value: 0,
      icon: <span className="inline-block w-4 h-4 bg-blue-500 rounded-full" />,
      growth: 0,
      description: "Movies in operation",
    },
    {
      title: "Total Showtimes",
      value: 0,
      icon: <span className="inline-block w-4 h-4 bg-green-500 rounded-full" />,
      growth: 0,
      description: "Showtimes scheduled",
    },
    {
      title: "Tickets Sold",
      value: 0,
      icon: (
        <span className="inline-block w-4 h-4 bg-yellow-500 rounded-full" />
      ),
      growth: 0,
      description: "Total bookings",
    },
    {
      title: "Total Revenue",
      value: "0đ",
      icon: (
        <span className="inline-block w-4 h-4 bg-purple-500 rounded-full" />
      ),
      growth: 0,
      description: "Total revenue generated",
    },
    {
      title: "User Comments",
      value: 0,
      icon: <span className="inline-block w-4 h-4 bg-pink-500 rounded-full" />,
      growth: 0,
      description: "Reviews and comments",
    },
    {
      title: "Registered Users",
      value: 0,
      icon: <span className="inline-block w-4 h-4 bg-gray-500 rounded-full" />,
      growth: 0,
      description: "Total registered users",
    },
  ]);

  useEffect(() => {
    dispatch(fetchDashboardStatsThunk());
    dispatch(fetchRevenueChartThunk({ period: "month", months: 12 }));
    dispatch(fetchRecentBookingsThunk({ limit: 5 }));
    dispatch(fetchRecentCommentsThunk({ limit: 5 }));
    dispatch(fetchRevenueAnalyticsThunk());
  }, [dispatch]);

  useEffect(() => {
    setStatsCards([
      {
        title: "Total Movies",
        value: stats?.totalMovies || 0,
        icon: (
          <span className="inline-block w-4 h-4 bg-blue-500 rounded-full" />
        ),
        growth: stats?.movieGrowth || 0,
        description: "Movies in operation",
      },
      {
        title: "Total Showtimes",
        value: stats?.totalShowtimes || 0,
        icon: (
          <span className="inline-block w-4 h-4 bg-green-500 rounded-full" />
        ),
        growth: stats?.showtimeGrowth || 0,
        description: "Showtimes scheduled",
      },
      {
        title: "Tickets Sold",
        value: stats?.totalBookings || 0,
        icon: (
          <span className="inline-block w-4 h-4 bg-yellow-500 rounded-full" />
        ),
        growth: stats?.bookingGrowth || 0,
        description: "Total bookings",
      },
      {
        title: "Total Revenue",
        value: `${(stats?.totalRevenue || 0).toLocaleString()}đ`,
        icon: (
          <span className="inline-block w-4 h-4 bg-purple-500 rounded-full" />
        ),
        growth: stats?.revenueGrowth || 0,
        description: "Total revenue generated",
      },
      {
        title: "User Comments",
        value: stats?.totalComments || 0,
        icon: (
          <span className="inline-block w-4 h-4 bg-pink-500 rounded-full" />
        ),
        growth: stats?.commentGrowth || 0,
        description: "Reviews and comments",
      },
      {
        title: "Registered Users",
        value: stats?.totalUsers || 0,
        icon: (
          <span className="inline-block w-4 h-4 bg-gray-500 rounded-full" />
        ),
        growth: stats?.userGrowth || 0,
        description: "Total registered users",
      },
    ]);
  }, [stats]);

  if (loading && !stats) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 dark:border-green-400"></div>
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              Loading...
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
              Loading...
            </span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of the cinema management system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Online</Badge>
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString("en-US")}
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
                    compared to last month
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
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
          <TabsTrigger value="comments">Recent Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue trend</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartAreaInteractive
                  data={revenueChart?.data || []}
                  valueKey="revenue"
                  labelKey="month"
                  title="Revenue by Month"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ticket Sales</CardTitle>
                <CardDescription>Monthly ticket sales trend</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartAreaInteractive
                  data={revenueChart?.data || []}
                  valueKey="tickets"
                  labelKey="month"
                  title="Ticket Sales by Month"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Detailed revenue and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {revenueAnalytics?.totalRevenue?.toLocaleString() || 0}đ
                  </div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {revenueAnalytics?.averageTicketPrice?.toLocaleString() ||
                      0}
                    đ
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Average Ticket Price
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {revenueAnalytics?.growthRate || 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">Growth Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest booking activity</CardDescription>
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
                            Seats: {getSeatString(booking.seats)}
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
                            ? "Confirmed"
                            : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">
                    No recent bookings data.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Comments</CardTitle>
              <CardDescription>
                Latest reviews and feedback from users
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
                    No recent comments.
                  </div>
                )}
                <div className="text-center pt-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {recentComments?.averageRating?.toFixed(1) || "0.0"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Average Rating
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
