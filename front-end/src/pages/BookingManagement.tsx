import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  Clock,
  MapPin,
  Filter,
  Download,
  Pencil,
  CheckCircle2,
  XCircle,
  UserCheck,
  AlarmClock,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminBookingsThunk } from "@/store/slices/bookingSlice";
import { useEffect } from "react";
import type { Booking, Seat } from "@/services/type";
import { BookingStatus } from "@/services/type";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "use-debounce";
import { UpdateBookingForm } from "@/components/UpdateBookingForm";

const theaters = [
  "CGV Aeon Mall",
  "Lotte Cinema Diamond",
  "Galaxy Cinema Nguyễn Du",
  "BHD Star Bitexco",
  "CGV Crescent Mall",
  "Lotte Cinema Landmark",
];
const statuses = [
  { label: "Đang chờ", value: BookingStatus.PENDING },
  { label: "Đã xác nhận", value: BookingStatus.CONFIRMED },
  { label: "Đã hủy", value: BookingStatus.CANCELED },
  { label: "Đã sử dụng", value: BookingStatus.USED },
  { label: "Hết hạn", value: BookingStatus.EXPIRED },
];

export default function BookingManagement() {
  const dispatch = useAppDispatch();
  const { adminBookings, loading } = useAppSelector((state) => state.booking);
  const [filters, setFilters] = useState({
    search: "",
    movieName: "",
    theater: "all",
    status: "all",
    // paymentMethod: "all", // nếu backend hỗ trợ thì thêm
  });
  const [debouncedSearch] = useDebounce(filters.search, 500);
  const [debouncedMovieName] = useDebounce(filters.movieName, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Gửi filter + page + limit lên thunk
  useEffect(() => {
    dispatch(
      fetchAdminBookingsThunk({
        page: currentPage,
        limit: itemsPerPage,
        customerName: debouncedSearch || undefined,
        movieName: debouncedMovieName || undefined,
        theaterName: filters.theater !== "all" ? filters.theater : undefined,
        status:
          filters.status !== "all"
            ? (filters.status as BookingStatus)
            : undefined,
        // paymentMethod: filters.paymentMethod !== "all" ? filters.paymentMethod : undefined,
      })
    );
  }, [
    dispatch,
    currentPage,
    itemsPerPage,
    debouncedSearch,
    debouncedMovieName,
    filters.theater,
    filters.status,
  ]);

  // Nếu chưa có data, show loading hoặc empty
  if (!adminBookings) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-muted-foreground text-lg">
          Đang tải dữ liệu đặt vé...
        </span>
      </div>
    );
  }

  // FE pagination nếu backend chỉ trả về 1 trang
  let paginatedBookings = adminBookings.data;
  let totalPages = adminBookings.totalPages || 1;
  let currentPageDisplay = adminBookings.currentPage || 1;
  let startIndex = 0;
  let endIndex = 0;

  if (
    adminBookings.totalPages === 1 &&
    adminBookings.data.length > itemsPerPage
  ) {
    totalPages = Math.ceil(adminBookings.data.length / itemsPerPage);
    currentPageDisplay = currentPage;
    startIndex = (currentPage - 1) * itemsPerPage;
    endIndex = startIndex + itemsPerPage;
    paginatedBookings = adminBookings.data.slice(startIndex, endIndex);
  } else {
    startIndex = adminBookings.pageSize * (adminBookings.currentPage - 1);
    endIndex = Math.min(
      adminBookings.pageSize * adminBookings.currentPage,
      adminBookings.total
    );
  }

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" /> Pending
          </Badge>
        );
      case BookingStatus.CONFIRMED:
        return (
          <Badge className="bg-green-100 text-green-800 ">
            <CheckCircle2 className="w-4 h-4 mr-1" /> Confirmed
          </Badge>
        );
      case BookingStatus.CANCELED:
        return (
          <Badge className="bg-red-100 text-red-800 ">
            <XCircle className="w-4 h-4 mr-1" /> Canceled
          </Badge>
        );
      case BookingStatus.USED:
        return (
          <Badge className="bg-blue-100 text-blue-800 ">
            <UserCheck className="w-4 h-4 mr-1" /> Used
          </Badge>
        );
      case BookingStatus.EXPIRED:
        return (
          <Badge className="bg-gray-100 text-gray-800 ">
            <AlarmClock className="w-4 h-4 mr-1" /> Expired
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const exportToPDF = (booking: Booking) => {
    // Tạo nội dung PDF
    const content = `
      CHI TIẾT ĐẶT VÉ
      
      Mã booking: ${booking.id}
      
      THÔNG TIN PHIM:
      - Tên phim: ${booking.showtime?.movie?.title}
      - Rạp: ${booking.showtime?.room?.theater?.name}
      - Phòng: ${booking.showtime?.room?.name}
      - Suất chiếu: ${
        booking.showtime?.time && booking.showtime?.time[0]
          ? new Date(booking.showtime?.time[0].start).toLocaleString("vi-VN")
          : ""
      }
      
      THÔNG TIN KHÁCH HÀNG:
      - Tên: ${booking.user?.name}
      - Email: ${booking.user?.email}
      - Số điện thoại: ${booking.user?.phone}
      
      THÔNG TIN ĐẶT VÉ:
      - Ngày đặt: ${new Date(booking.createdAt).toLocaleString("vi-VN")}
      - Ghế: ${
        Array.isArray(booking.seats)
          ? booking.seats.map((s: Seat) => `${s.row}${s.number}`).join(", ")
          : ""
      }
      - Tổng tiền: ${booking.totalPrice.toLocaleString()} VNĐ
      - Trạng thái: ${booking.status}
      
      ${
        booking.payment
          ? `
      THÔNG TIN THANH TOÁN:
      - Trạng thái: ${booking.payment.status}
      - Số tiền: ${booking.payment.amount.toLocaleString()} VNĐ
      - Mã thanh toán: ${booking.payment.stripePaymentId}
      - Thời gian thanh toán: ${
        booking.payment.paidAt
          ? new Date(booking.payment.paidAt).toLocaleString("vi-VN")
          : ""
      }
      `
          : ""
      }
    `;

    // Tạo blob và download
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-${booking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const exportToCSV = (booking: Booking) => {
    const csvContent = [
      [
        "Mã booking",
        "Tên phim",
        "Rạp",
        "Phòng",
        "Suất chiếu",
        "Khách hàng",
        "Email",
        "Số điện thoại",
        "Ngày đặt",
        "Ghế",
        "Tổng tiền",
        "Trạng thái",
        "Thanh toán",
        "Mã thanh toán",
      ],
      [
        booking.id,
        booking.showtime?.movie?.title || "",
        booking.showtime?.room?.theater?.name || "",
        booking.showtime?.room?.name || "",
        booking.showtime?.time && booking.showtime?.time[0]
          ? new Date(booking.showtime?.time[0].start).toLocaleString("vi-VN")
          : "",
        booking.user?.name || "",
        booking.user?.email || "",
        booking.user?.phone || "",
        new Date(booking.createdAt).toLocaleString("vi-VN"),
        Array.isArray(booking.seats)
          ? booking.seats.map((s: Seat) => `${s.row}${s.number}`).join(", ")
          : "",
        booking.totalPrice.toLocaleString(),
        booking.status,
        booking.payment?.status || "",
        booking.payment?.stripePaymentId || "",
      ],
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-${booking.id}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Booking Management</h1>
          <p className="text-muted-foreground">
            Manage all bookings and ticket information
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => dispatch(fetchAdminBookingsThunk({ page: currentPage, limit: itemsPerPage }))}>
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Tìm kiếm khách hàng */}
            <div className="space-y-2">
              <Label htmlFor="search">Search by customer name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by customer name..."
                  value={filters.search}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, search: e.target.value }));
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
                {filters.search !== debouncedSearch && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 dark:border-green-400"></div>
                  </div>
                )}
              </div>
            </div>
            {/* Movie name search */}
            <div className="space-y-2">
              <Label htmlFor="movieName-search">Search by movie name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="movieName-search"
                  placeholder="Search by movie name..."
                  value={filters.movieName}
                  onChange={(e) => {
                    setFilters((prev) => ({
                      ...prev,
                      movieName: e.target.value,
                    }));
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
                {filters.movieName !== debouncedMovieName && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 dark:border-green-400"></div>
                  </div>
                )}
              </div>
            </div>
            {/* Rạp chiếu */}
            <div className="space-y-2">
              <Label htmlFor="theater-filter">Theater</Label>
              <Select
                value={filters.theater}
                onValueChange={(v) => {
                  setFilters((prev) => ({ ...prev, theater: v }));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All theaters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All theaters</SelectItem>
                  {theaters.map((theater) => (
                    <SelectItem key={theater} value={theater}>
                      {theater}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Trạng thái */}
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(v) => {
                  setFilters((prev) => ({ ...prev, status: v }));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Nút xóa bộ lọc */}
            <div className="flex items-end justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    search: "",
                    movieName: "",
                    theater: "all",
                    status: "all",
                  });
                  setCurrentPage(1);
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking List</CardTitle>
          <CardDescription>
            {adminBookings.total <= itemsPerPage
              ? `Displaying ${adminBookings.total} out of ${adminBookings.total} bookings`
              : `Displaying ${startIndex + 1} to ${endIndex} out of ${
                  adminBookings.total
                } bookings`}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Movie Details</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Showtime</TableHead>
                <TableHead>Seats & Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? [...Array(5)].map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Skeleton className="w-24 h-4" />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Skeleton className="w-28 h-4" />
                          <Skeleton className="w-32 h-3" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Skeleton className="w-20 h-4" />
                          <Skeleton className="w-24 h-3" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-28 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-20 h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-16 h-4" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="w-8 h-4 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : paginatedBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">{booking.id}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {booking.showtime?.movie?.title}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {booking.showtime?.room?.theater?.name} -{" "}
                            {booking.showtime?.room?.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {booking.user?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {booking.user?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking.showtime?.time &&
                              booking.showtime?.time[0] &&
                              new Date(
                                booking.showtime?.time[0].start
                              ).toLocaleString("vi-VN")}
                          </div>
                          <div className="text-muted-foreground">
                            Booked: {new Date(booking.createdAt).toLocaleDateString("en-US")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            Seat {Array.isArray(booking.seats)
                              ? booking.seats
                                  .map((s: Seat) => `${s.row}${s.number}`)
                                  .join(", ")
                              : ""}
                          </div>
                          <div className="text-muted-foreground">
                            {booking.totalPrice.toLocaleString()} VND
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status as BookingStatus)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDetailBooking(booking);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditBooking(booking);
                            setIsEditOpen(true);
                          }}
                          className="ml-1"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Displaying {startIndex + 1} to {endIndex} out of {adminBookings.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPageDisplay - 1)}
                disabled={currentPageDisplay === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPageDisplay} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPageDisplay + 1)}
                disabled={currentPageDisplay === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Dialog xem chi tiết booking */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {detailBooking && (
            <div className="space-y-6">
              {/* Thông tin phim */}
              <div>
                <div className="font-semibold text-lg mb-2 flex items-center gap-2">
                  🎬 Movie Details
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">Movie Name:</span>{" "}
                    {detailBooking.showtime?.movie?.title}
                  </div>
                  <div>
                    <span className="font-medium">Theater:</span>{" "}
                    {detailBooking.showtime?.room?.theater?.name}
                  </div>
                  <div>
                    <span className="font-medium">Room:</span>{" "}
                    {detailBooking.showtime?.room?.name}
                  </div>
                  <div>
                    <span className="font-medium">Showtime:</span>{" "}
                    {detailBooking.showtime?.time &&
                      detailBooking.showtime?.time[0] &&
                      new Date(
                        detailBooking.showtime?.time[0].start
                      ).toLocaleString("vi-VN")}
                  </div>
                </div>
              </div>
              {/* Thông tin khách hàng */}
              <div>
                <div className="font-semibold text-lg mb-2 flex items-center gap-2">
                  👤 Customer Details
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {detailBooking.user?.name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {detailBooking.user?.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {detailBooking.user?.phone}
                  </div>
                  <div>
                    <span className="font-medium">Role:</span>{" "}
                    {detailBooking.user?.role}
                  </div>
                </div>
              </div>
              {/* Thông tin đặt vé */}
              <div>
                <div className="font-semibold text-lg mb-2 flex items-center gap-2">
                  🎟️ Booking Details
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">Booking ID:</span>{" "}
                    {detailBooking.id}
                  </div>
                  <div>
                    <span className="font-medium">Booking Date:</span>{" "}
                    {new Date(detailBooking.createdAt).toLocaleString("vi-VN")}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Seats:</span>{" "}
                    {Array.isArray(detailBooking.seats)
                      ? detailBooking.seats
                          .map((s: Seat) => `${s.row}${s.number}`)
                          .join(", ")
                      : ""}
                  </div>
                  <div>
                    <span className="font-medium">Total Price:</span>{" "}
                    <span className="text-primary font-semibold">
                      {detailBooking.totalPrice.toLocaleString()} VND
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    {getStatusBadge(detailBooking.status as BookingStatus)}
                  </div>
                </div>
              </div>
              {/* Thông tin thanh toán */}
              {detailBooking.payment && (
                <div>
                  <div className="font-semibold text-lg mb-2 flex items-center gap-2">
                    💳 Payment Details
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={
                          detailBooking.payment.status === "PAID"
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {detailBooking.payment.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span>{" "}
                      {detailBooking.payment.amount.toLocaleString()} VND
                    </div>
                    <div>
                      <span className="font-medium">Payment ID:</span>{" "}
                      {detailBooking.payment.stripePaymentId}
                    </div>
                    <div>
                      <span className="font-medium">Payment Date:</span>{" "}
                      {detailBooking.payment.paidAt &&
                        new Date(detailBooking.payment.paidAt).toLocaleString(
                          "vi-VN"
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* Nút Export */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => exportToPDF(detailBooking)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
                <Button
                  onClick={() => exportToCSV(detailBooking)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Dialog cập nhật trạng thái booking */}
      <UpdateBookingForm
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        booking={editBooking}
        onSuccess={() => {
          setEditBooking(null);
          setIsEditOpen(false);
          // Refetch danh sách sau khi update
          dispatch(
            fetchAdminBookingsThunk({
              page: currentPage,
              limit: itemsPerPage,
              customerName: debouncedSearch || undefined,
              movieName: debouncedMovieName || undefined,
              theaterName:
                filters.theater !== "all" ? filters.theater : undefined,
              status:
                filters.status !== "all"
                  ? (filters.status as BookingStatus)
                  : undefined,
            })
          );
        }}
      />
    </div>
  );
}
