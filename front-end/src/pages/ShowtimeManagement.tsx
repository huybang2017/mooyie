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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Film,
  Users,
  MoreHorizontal,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Filter,
} from "lucide-react";

interface Showtime {
  id: string;
  movieTitle: string;
  movieId: string;
  theaterName: string;
  theaterId: string;
  roomName: string;
  roomId: string;
  date: string;
  time: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  status: "upcoming" | "active" | "completed" | "cancelled";
  bookings: number;
  revenue: number;
}

// Fake data
const fakeShowtimes: Showtime[] = [
  {
    id: "1",
    movieTitle: "Inception",
    movieId: "movie1",
    theaterName: "CGV Aeon Mall",
    theaterId: "theater1",
    roomName: "Phòng 1",
    roomId: "room1",
    date: "2024-01-15",
    time: "19:00",
    price: 12.0,
    totalSeats: 120,
    availableSeats: 45,
    status: "upcoming",
    bookings: 75,
    revenue: 900.0,
  },
  {
    id: "2",
    movieTitle: "The Matrix",
    movieId: "movie2",
    theaterName: "CGV Aeon Mall",
    theaterId: "theater1",
    roomName: "Phòng 2",
    roomId: "room2",
    date: "2024-01-15",
    time: "20:30",
    price: 10.0,
    totalSeats: 100,
    availableSeats: 20,
    status: "active",
    bookings: 80,
    revenue: 800.0,
  },
  {
    id: "3",
    movieTitle: "Interstellar",
    movieId: "movie3",
    theaterName: "Lotte Cinema",
    theaterId: "theater2",
    roomName: "Phòng VIP",
    roomId: "room3",
    date: "2024-01-14",
    time: "21:00",
    price: 15.0,
    totalSeats: 80,
    availableSeats: 0,
    status: "completed",
    bookings: 80,
    revenue: 1200.0,
  },
  {
    id: "4",
    movieTitle: "The Dark Knight",
    movieId: "movie4",
    theaterName: "Galaxy Cinema",
    theaterId: "theater3",
    roomName: "Phòng 3",
    roomId: "room4",
    date: "2024-01-16",
    time: "18:30",
    price: 11.0,
    totalSeats: 150,
    availableSeats: 120,
    status: "upcoming",
    bookings: 30,
    revenue: 330.0,
  },
  {
    id: "5",
    movieTitle: "Avatar",
    movieId: "movie5",
    theaterName: "CGV Aeon Mall",
    theaterId: "theater1",
    roomName: "Phòng IMAX",
    roomId: "room5",
    date: "2024-01-13",
    time: "19:30",
    price: 18.0,
    totalSeats: 200,
    availableSeats: 0,
    status: "completed",
    bookings: 200,
    revenue: 3600.0,
  },
  {
    id: "6",
    movieTitle: "Titanic",
    movieId: "movie6",
    theaterName: "Lotte Cinema",
    theaterId: "theater2",
    roomName: "Phòng 1",
    roomId: "room6",
    date: "2024-01-15",
    time: "14:00",
    price: 9.0,
    totalSeats: 120,
    availableSeats: 90,
    status: "upcoming",
    bookings: 30,
    revenue: 270.0,
  },
  {
    id: "7",
    movieTitle: "The Shawshank Redemption",
    movieId: "movie7",
    theaterName: "Galaxy Cinema",
    theaterId: "theater3",
    roomName: "Phòng 2",
    roomId: "room7",
    date: "2024-01-14",
    time: "16:00",
    price: 8.0,
    totalSeats: 100,
    availableSeats: 0,
    status: "completed",
    bookings: 100,
    revenue: 800.0,
  },
  {
    id: "8",
    movieTitle: "Pulp Fiction",
    movieId: "movie8",
    theaterName: "CGV Aeon Mall",
    theaterId: "theater1",
    roomName: "Phòng 3",
    roomId: "room8",
    date: "2024-01-17",
    time: "22:00",
    price: 10.0,
    totalSeats: 80,
    availableSeats: 60,
    status: "upcoming",
    bookings: 20,
    revenue: 200.0,
  },
];

const movies = [
  { id: "movie1", title: "Inception" },
  { id: "movie2", title: "The Matrix" },
  { id: "movie3", title: "Interstellar" },
  { id: "movie4", title: "The Dark Knight" },
  { id: "movie5", title: "Avatar" },
  { id: "movie6", title: "Titanic" },
  { id: "movie7", title: "The Shawshank Redemption" },
  { id: "movie8", title: "Pulp Fiction" },
];

const theaters = [
  { id: "theater1", name: "CGV Aeon Mall" },
  { id: "theater2", name: "Lotte Cinema" },
  { id: "theater3", name: "Galaxy Cinema" },
];

const rooms = [
  { id: "room1", name: "Phòng 1", theaterId: "theater1" },
  { id: "room2", name: "Phòng 2", theaterId: "theater1" },
  { id: "room3", name: "Phòng VIP", theaterId: "theater2" },
  { id: "room4", name: "Phòng 3", theaterId: "theater3" },
  { id: "room5", name: "Phòng IMAX", theaterId: "theater1" },
  { id: "room6", name: "Phòng 1", theaterId: "theater2" },
  { id: "room7", name: "Phòng 2", theaterId: "theater3" },
  { id: "room8", name: "Phòng 3", theaterId: "theater1" },
];

const statuses = ["upcoming", "active", "completed", "cancelled"];

export default function ShowtimeManagement() {
  const [showtimes, setShowtimes] = useState<Showtime[]>(fakeShowtimes);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("all");
  const [selectedTheater, setSelectedTheater] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    movieId: "",
    theaterId: "",
    roomId: "",
    date: "",
    time: "",
    price: "",
    status: "upcoming",
  });

  const handleCreateShowtime = () => {
    const selectedMovieData = movies.find((m) => m.id === formData.movieId);
    const selectedTheaterData = theaters.find(
      (t) => t.id === formData.theaterId
    );
    const selectedRoomData = rooms.find((r) => r.id === formData.roomId);

    const newShowtime: Showtime = {
      id: Date.now().toString(),
      movieTitle: selectedMovieData?.title || "",
      movieId: formData.movieId,
      theaterName: selectedTheaterData?.name || "",
      theaterId: formData.theaterId,
      roomName: selectedRoomData?.name || "",
      roomId: formData.roomId,
      date: formData.date,
      time: formData.time,
      price: parseFloat(formData.price),
      totalSeats: 120, // Default value
      availableSeats: 120,
      status: formData.status as any,
      bookings: 0,
      revenue: 0,
    };
    setShowtimes([...showtimes, newShowtime]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditShowtime = () => {
    if (editingShowtime) {
      const selectedMovieData = movies.find((m) => m.id === formData.movieId);
      const selectedTheaterData = theaters.find(
        (t) => t.id === formData.theaterId
      );
      const selectedRoomData = rooms.find((r) => r.id === formData.roomId);

      const updatedShowtimes = showtimes.map((showtime) =>
        showtime.id === editingShowtime.id
          ? {
              ...showtime,
              movieTitle: selectedMovieData?.title || "",
              movieId: formData.movieId,
              theaterName: selectedTheaterData?.name || "",
              theaterId: formData.theaterId,
              roomName: selectedRoomData?.name || "",
              roomId: formData.roomId,
              date: formData.date,
              time: formData.time,
              price: parseFloat(formData.price),
              status: formData.status as any,
            }
          : showtime
      );
      setShowtimes(updatedShowtimes);
      setIsEditDialogOpen(false);
      setEditingShowtime(null);
      resetForm();
    }
  };

  const handleDeleteShowtime = (id: string) => {
    setShowtimes(showtimes.filter((showtime) => showtime.id !== id));
  };

  const openEditDialog = (showtime: Showtime) => {
    setEditingShowtime(showtime);
    setFormData({
      movieId: showtime.movieId,
      theaterId: showtime.theaterId,
      roomId: showtime.roomId,
      date: showtime.date,
      time: showtime.time,
      price: showtime.price.toString(),
      status: showtime.status,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      movieId: "",
      theaterId: "",
      roomId: "",
      date: "",
      time: "",
      price: "",
      status: "upcoming",
    });
  };

  // Filter showtimes
  const filteredShowtimes = showtimes.filter((showtime) => {
    const matchesSearch =
      showtime.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showtime.theaterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showtime.roomName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMovie =
      selectedMovie === "all" || showtime.movieId === selectedMovie;
    const matchesTheater =
      selectedTheater === "all" || showtime.theaterId === selectedTheater;
    const matchesStatus =
      selectedStatus === "all" || showtime.status === selectedStatus;

    return matchesSearch && matchesMovie && matchesTheater && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredShowtimes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShowtimes = filteredShowtimes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Sắp tới
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Đang chiếu
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Đã hoàn thành
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAvailableRooms = (theaterId: string) => {
    return rooms.filter((room) => room.theaterId === theaterId);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý lịch chiếu</h1>
          <p className="text-muted-foreground">
            Quản lý lịch chiếu phim và thông tin suất chiếu
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm lịch chiếu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm lịch chiếu mới</DialogTitle>
              <DialogDescription>Tạo lịch chiếu mới cho phim</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="movie">Phim</Label>
                <Select
                  value={formData.movieId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, movieId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phim" />
                  </SelectTrigger>
                  <SelectContent>
                    {movies.map((movie) => (
                      <SelectItem key={movie.id} value={movie.id}>
                        {movie.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="theater">Rạp chiếu</Label>
                <Select
                  value={formData.theaterId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, theaterId: value, roomId: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn rạp" />
                  </SelectTrigger>
                  <SelectContent>
                    {theaters.map((theater) => (
                      <SelectItem key={theater.id} value={theater.id}>
                        {theater.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Phòng chiếu</Label>
                <Select
                  value={formData.roomId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, roomId: value })
                  }
                  disabled={!formData.theaterId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.theaterId &&
                      getAvailableRooms(formData.theaterId).map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Ngày chiếu</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Giờ chiếu</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Giá vé ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "upcoming" && "Sắp tới"}
                        {status === "active" && "Đang chiếu"}
                        {status === "completed" && "Đã hoàn thành"}
                        {status === "cancelled" && "Đã hủy"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCreateShowtime}>Thêm lịch chiếu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo phim, rạp, phòng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phim</Label>
              <Select value={selectedMovie} onValueChange={setSelectedMovie}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phim</SelectItem>
                  {movies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rạp chiếu</Label>
              <Select
                value={selectedTheater}
                onValueChange={setSelectedTheater}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả rạp</SelectItem>
                  {theaters.map((theater) => (
                    <SelectItem key={theater.id} value={theater.id}>
                      {theater.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "upcoming" && "Sắp tới"}
                      {status === "active" && "Đang chiếu"}
                      {status === "completed" && "Đã hoàn thành"}
                      {status === "cancelled" && "Đã hủy"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedMovie("all");
                  setSelectedTheater("all");
                  setSelectedStatus("all");
                }}
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
            Hiển thị {paginatedShowtimes.length} trong tổng số{" "}
            {filteredShowtimes.length} lịch chiếu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phim</TableHead>
                <TableHead>Rạp & Phòng</TableHead>
                <TableHead>Ngày & Giờ</TableHead>
                <TableHead>Giá vé</TableHead>
                <TableHead>Ghế</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Đặt vé</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedShowtimes.map((showtime) => (
                <TableRow key={showtime.id}>
                  <TableCell>
                    <div className="font-medium">{showtime.movieTitle}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{showtime.theaterName}</div>
                      <div className="text-sm text-muted-foreground">
                        {showtime.roomName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {new Date(showtime.date).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {showtime.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${showtime.price}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>
                        {showtime.availableSeats}/{showtime.totalSeats}
                      </div>
                      <div className="text-muted-foreground">
                        {Math.round(
                          (showtime.availableSeats / showtime.totalSeats) * 100
                        )}
                        % trống
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(showtime.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{showtime.bookings} vé</div>
                      <div className="text-muted-foreground">
                        ${showtime.revenue}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(showtime)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteShowtime(showtime.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Trang {currentPage} của {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa lịch chiếu</DialogTitle>
            <DialogDescription>Cập nhật thông tin lịch chiếu</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-movie">Phim</Label>
              <Select
                value={formData.movieId}
                onValueChange={(value) =>
                  setFormData({ ...formData, movieId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-theater">Rạp chiếu</Label>
              <Select
                value={formData.theaterId}
                onValueChange={(value) =>
                  setFormData({ ...formData, theaterId: value, roomId: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {theaters.map((theater) => (
                    <SelectItem key={theater.id} value={theater.id}>
                      {theater.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-room">Phòng chiếu</Label>
              <Select
                value={formData.roomId}
                onValueChange={(value) =>
                  setFormData({ ...formData, roomId: value })
                }
                disabled={!formData.theaterId}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formData.theaterId &&
                    getAvailableRooms(formData.theaterId).map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Ngày chiếu</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-time">Giờ chiếu</Label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Giá vé ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "upcoming" && "Sắp tới"}
                      {status === "active" && "Đang chiếu"}
                      {status === "completed" && "Đã hoàn thành"}
                      {status === "cancelled" && "Đã hủy"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleEditShowtime}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
