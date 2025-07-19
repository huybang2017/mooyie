import { useState, useEffect } from "react";
import { toast } from "sonner";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Filter } from "lucide-react";
import type { Showtime } from "@/services/type";
import { ShowtimeActionMenu } from "@/components/ShowtimeActionMenu";
import { CreateShowtimeForm } from "@/components/CreateShowtimeForm";
import { UpdateShowtimeForm } from "@/components/UpdateShowtimeForm";
import {
  fetchAdminShowtimesThunk,
  deleteShowtimeThunk,
} from "@/store/slices/showtimeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useDebounce } from "use-debounce";

export default function ShowtimeManagement() {
  const dispatch = useAppDispatch();
  const { adminShowtimes, loading, error } = useAppSelector(
    (state) => state.showtime
  );

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(
    null
  );
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filterDateTime, setFilterDateTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [movieSearch, setMovieSearch] = useState("");
  const [debouncedMovieSearch] = useDebounce(movieSearch, 500);

  useEffect(() => {
    dispatch(
      fetchAdminShowtimesThunk({
        page: currentPage,
        limit: itemsPerPage,
        movie: debouncedMovieSearch || undefined,
        time: filterDateTime || undefined,
        isActive:
          selectedStatus === "all"
            ? undefined
            : selectedStatus === "active"
            ? true
            : false,
      })
    );
  }, [
    dispatch,
    currentPage,
    itemsPerPage,
    debouncedMovieSearch,
    selectedStatus,
    filterDateTime,
  ]);

  const handleRefresh = () => {
    dispatch(
      fetchAdminShowtimesThunk({
        page: currentPage,
        limit: itemsPerPage,
        movie: debouncedMovieSearch || undefined,
        time: filterDateTime || undefined,
        isActive:
          selectedStatus === "all"
            ? undefined
            : selectedStatus === "active"
            ? true
            : false,
      })
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleMovieSearchChange = (value: string) => {
    setMovieSearch(value);
    setCurrentPage(1);
  };
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };
  const handleDateTimeChange = (value: string) => {
    setFilterDateTime(value);
    setCurrentPage(1);
  };
  const handleClearFilters = () => {
    setMovieSearch("");
    setSelectedStatus("all");
    setFilterDateTime("");
    setCurrentPage(1);
  };

  // Handler functions for ShowtimeActionMenu
  const handleViewShowtime = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setIsDetailDialogOpen(true);
  };

  const handleEditShowtime = (showtime: Showtime) => {
    setEditingShowtime(showtime);
    setIsUpdateDialogOpen(true);
  };

  const handleDeleteShowtime = async (showtime: Showtime) => {
    try {
      await dispatch(deleteShowtimeThunk(showtime.id)).unwrap();
      toast.success("Xóa lịch chiếu thành công");
      handleRefresh();
    } catch (error: any) {
      toast.error(error || "Có lỗi xảy ra khi xóa lịch chiếu");
    }
  };

  const handleCreateSuccess = () => {
    toast.success("Tạo lịch chiếu thành công");
    handleRefresh();
  };

  const handleUpdateSuccess = () => {
    toast.success("Cập nhật lịch chiếu thành công");
    setIsUpdateDialogOpen(false);
    setEditingShowtime(null);
    handleRefresh();
  };

  // Remove FE filtering, just use adminShowtimes?.data
  const showtimes = adminShowtimes?.data || [];
  const totalPages = adminShowtimes?.totalPages || 1;
  const totalItems = adminShowtimes?.total || 0;

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Đang chiếu
      </Badge>
    ) : (
      <Badge className="bg-neutral-100 text-neutral-800 hover:bg-neutral-100">
        Đã hoàn thành
      </Badge>
    );
  };

  if (loading && !adminShowtimes) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Đang tải dữ liệu...</div>
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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý lịch chiếu</h1>
          <p className="text-muted-foreground">
            Quản lý lịch chiếu phim và thông tin suất chiếu
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            Làm mới
          </Button>
          <CreateShowtimeForm onSuccess={handleCreateSuccess} />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Bộ lọc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Movie name search filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-movie">Phim</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filter-movie"
                  placeholder="Tìm theo tên phim..."
                  value={movieSearch}
                  onChange={(e) => handleMovieSearchChange(e.target.value)}
                  className="pl-10"
                />
                {movieSearch !== debouncedMovieSearch && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 dark:border-green-400"></div>
                  </div>
                )}
              </div>
            </div>
            {/* Status filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-status">Trạng thái</Label>
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Đang chiếu</SelectItem>
                  <SelectItem value="inactive">Đã hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Time filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-datetime">Thời gian chiếu</Label>
              <Input
                id="filter-datetime"
                type="datetime-local"
                value={filterDateTime}
                onChange={(e) => handleDateTimeChange(e.target.value)}
              />
            </div>
            {/* Clear filters button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lịch chiếu</CardTitle>
          <CardDescription>
            Hiển thị {showtimes.length} trong tổng số {totalItems} lịch chiếu
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phim</TableHead>
                <TableHead>Rạp & Phòng</TableHead>
                <TableHead>Ngày & Giờ</TableHead>
                <TableHead>Ghế</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? [...Array(5)].map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={6}>
                        <div className="flex items-center space-x-4 p-4">
                          <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-32 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : showtimes.map((showtime: Showtime) => (
                    <TableRow key={showtime.id}>
                      <TableCell>
                        <div className="font-medium">
                          {showtime.movie?.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {showtime.room?.theater?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {showtime.room?.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {showtime.time &&
                              showtime.time[0] &&
                              new Date(showtime.time[0].start).toLocaleString(
                                "vi-VN"
                              )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {showtime.time &&
                              showtime.time[0] &&
                              new Date(showtime.time[0].end).toLocaleString(
                                "vi-VN"
                              )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{showtime.room?.seatCount || 0} ghế</div>
                          <div className="text-muted-foreground">
                            {showtime.room?.seats?.length || 0} ghế có sẵn
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(showtime.isActive)}</TableCell>
                      <TableCell>
                        <ShowtimeActionMenu
                          showtime={showtime}
                          onView={handleViewShowtime}
                          onEdit={handleEditShowtime}
                          onDelete={handleDeleteShowtime}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} trong{" "}
              {totalItems} kết quả
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <div className="text-sm">
                Trang {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="min-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch chiếu</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về lịch chiếu và giá vé từng ghế
            </DialogDescription>
          </DialogHeader>
          {selectedShowtime && (
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Thông tin phim
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Tên phim:</span>
                      <span>{selectedShowtime.movie?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Thể loại:</span>
                      <span>{selectedShowtime.movie?.genre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Thời lượng:</span>
                      <span>{selectedShowtime.movie?.duration} phút</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Thông tin rạp
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Rạp:</span>
                      <span>{selectedShowtime.room?.theater?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Phòng:</span>
                      <span>{selectedShowtime.room?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Địa chỉ:</span>
                      <span className="text-right max-w-xs">
                        {selectedShowtime.room?.theater?.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin thời gian */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Thời gian chiếu
                </h3>
                <div className="space-y-2 text-sm">
                  {selectedShowtime.time &&
                    selectedShowtime.time.map(
                      (
                        timeSlot: { start: string; end: string },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">Bắt đầu:</span>
                            <span>
                              {new Date(timeSlot.start).toLocaleString("vi-VN")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Kết thúc:</span>
                            <span>
                              {new Date(timeSlot.end).toLocaleString("vi-VN")}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                </div>
              </div>

              {/* Danh sách ghế và giá vé */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Danh sách ghế và giá vé
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-96 overflow-y-auto">
                  {selectedShowtime.room?.seats?.map((seat: any) => (
                    <div
                      key={seat.id}
                      className="border rounded-lg p-2 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <div className="text-center space-y-1">
                        <div className="font-medium text-xs">
                          Ghế {seat.row}
                          {seat.number}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {seat.type === "REGULAR" ? "Thường" : "VIP"}
                        </div>
                        <div className="font-semibold text-green-600 text-xs">
                          {seat.price.toLocaleString("vi-VN")} VNĐ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground pt-2 border-t">
                  Tổng cộng: {selectedShowtime.room?.seats?.length || 0} ghế
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Showtime Form */}
      <UpdateShowtimeForm
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        showtime={editingShowtime}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
