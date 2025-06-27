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
import { Textarea } from "@/components/ui/textarea";
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
  Building2,
  MapPin,
  Phone,
  Mail,
  Users,
  Calendar,
  DollarSign,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Filter,
} from "lucide-react";

interface Theater {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  capacity: number;
  totalRooms: number;
  status: "active" | "inactive" | "maintenance";
  totalBookings: number;
  revenue: number;
  description: string;
  openingHours: string;
  amenities: string[];
}

// Fake data
const fakeTheaters: Theater[] = [
  {
    id: "1",
    name: "CGV Aeon Mall",
    address: "30 Bờ Bao Tân Thắng, Tân Phú",
    city: "TP.HCM",
    phone: "028 7300 8888",
    email: "cgv.aeon@cgv.vn",
    capacity: 1200,
    totalRooms: 8,
    status: "active",
    totalBookings: 2456,
    revenue: 45678.5,
    description: "Rạp chiếu phim hiện đại với 8 phòng chiếu và công nghệ IMAX",
    openingHours: "09:00 - 23:00",
    amenities: ["IMAX", "4DX", "Dolby Atmos", "VIP Seats", "Food Court"],
  },
  {
    id: "2",
    name: "Lotte Cinema Diamond",
    address: "34 Lê Duẩn, Bến Nghé, Quận 1",
    city: "TP.HCM",
    phone: "028 7300 9999",
    email: "lotte.diamond@lotte.vn",
    capacity: 800,
    totalRooms: 6,
    status: "active",
    totalBookings: 1890,
    revenue: 34250.75,
    description: "Rạp chiếu phim cao cấp tại trung tâm thành phố",
    openingHours: "08:30 - 23:30",
    amenities: ["Dolby Atmos", "VIP Seats", "Premium Food", "Valet Parking"],
  },
  {
    id: "3",
    name: "Galaxy Cinema Nguyễn Du",
    address: "116 Nguyễn Du, Quận 1",
    city: "TP.HCM",
    phone: "028 7300 7777",
    email: "galaxy.nguyendu@galaxy.vn",
    capacity: 600,
    totalRooms: 4,
    status: "maintenance",
    totalBookings: 1234,
    revenue: 21560.25,
    description: "Rạp chiếu phim cổ điển với không gian ấm cúng",
    openingHours: "09:00 - 22:30",
    amenities: ["Dolby Digital", "Comfortable Seats", "Snack Bar"],
  },
  {
    id: "4",
    name: "BHD Star Bitexco",
    address: "2 Hải Triều, Quận 1",
    city: "TP.HCM",
    phone: "028 7300 6666",
    email: "bhd.bitexco@bhd.vn",
    capacity: 900,
    totalRooms: 7,
    status: "active",
    totalBookings: 2100,
    revenue: 38900.0,
    description: "Rạp chiếu phim hiện đại tại tòa nhà Bitexco",
    openingHours: "09:00 - 23:00",
    amenities: ["4K Projection", "Dolby Atmos", "Premium Seats", "Sky Bar"],
  },
  {
    id: "5",
    name: "CGV Crescent Mall",
    address: "101 Tôn Dật Tiên, Quận 7",
    city: "TP.HCM",
    phone: "028 7300 5555",
    email: "cgv.crescent@cgv.vn",
    capacity: 1000,
    totalRooms: 6,
    status: "inactive",
    totalBookings: 890,
    revenue: 15670.5,
    description: "Rạp chiếu phim tại khu vực Phú Mỹ Hưng",
    openingHours: "09:00 - 22:00",
    amenities: ["Dolby Digital", "Food Court", "Playground"],
  },
  {
    id: "6",
    name: "Lotte Cinema Landmark",
    address: "Vinhomes Central Park, Quận 1",
    city: "TP.HCM",
    phone: "028 7300 4444",
    email: "lotte.landmark@lotte.vn",
    capacity: 1500,
    totalRooms: 10,
    status: "active",
    totalBookings: 3200,
    revenue: 58750.25,
    description: "Rạp chiếu phim lớn nhất tại Landmark 81",
    openingHours: "08:00 - 24:00",
    amenities: ["IMAX", "4DX", "Dolby Atmos", "VIP Lounge", "Fine Dining"],
  },
];

const cities = [
  "TP.HCM",
  "Hà Nội",
  "Đà Nẵng",
  "Cần Thơ",
  "Nha Trang",
  "Vũng Tàu",
];
const statuses = ["active", "inactive", "maintenance"];

export default function TheaterManagement() {
  const [theaters, setTheaters] = useState<Theater[]>(fakeTheaters);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTheater, setEditingTheater] = useState<Theater | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    capacity: "",
    totalRooms: "",
    status: "active",
    description: "",
    openingHours: "",
    amenities: "",
  });

  const handleCreateTheater = () => {
    const newTheater: Theater = {
      id: Date.now().toString(),
      name: formData.name,
      address: formData.address,
      city: formData.city,
      phone: formData.phone,
      email: formData.email,
      capacity: parseInt(formData.capacity),
      totalRooms: parseInt(formData.totalRooms),
      status: formData.status as "active" | "inactive" | "maintenance",
      totalBookings: 0,
      revenue: 0,
      description: formData.description,
      openingHours: formData.openingHours,
      amenities: formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
    };
    setTheaters([...theaters, newTheater]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditTheater = () => {
    if (editingTheater) {
      const updatedTheaters = theaters.map((theater) =>
        theater.id === editingTheater.id
          ? {
              ...theater,
              ...formData,
              capacity: parseInt(formData.capacity),
              totalRooms: parseInt(formData.totalRooms),
              amenities: formData.amenities
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item !== ""),
            }
          : theater
      );
      setTheaters(updatedTheaters);
      setIsEditDialogOpen(false);
      setEditingTheater(null);
      resetForm();
    }
  };

  const handleDeleteTheater = (id: string) => {
    setTheaters(theaters.filter((theater) => theater.id !== id));
  };

  const openEditDialog = (theater: Theater) => {
    setEditingTheater(theater);
    setFormData({
      name: theater.name,
      address: theater.address,
      city: theater.city,
      phone: theater.phone,
      email: theater.email,
      capacity: theater.capacity.toString(),
      totalRooms: theater.totalRooms.toString(),
      status: theater.status,
      description: theater.description,
      openingHours: theater.openingHours,
      amenities: theater.amenities.join(", "),
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      capacity: "",
      totalRooms: "",
      status: "active",
      description: "",
      openingHours: "",
      amenities: "",
    });
  };

  // Filter theaters
  const filteredTheaters = theaters.filter((theater) => {
    const matchesSearch =
      theater.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theater.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theater.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "all" || theater.city === selectedCity;
    const matchesStatus =
      selectedStatus === "all" || theater.status === selectedStatus;
    return matchesSearch && matchesCity && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTheaters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTheaters = filteredTheaters.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Hoạt động
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Ngừng hoạt động
          </Badge>
        );
      case "maintenance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Bảo trì
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý rạp chiếu</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách rạp chiếu và thông tin chi tiết
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm rạp chiếu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm rạp chiếu mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin rạp chiếu mới
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên rạp chiếu</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Thành phố</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) =>
                    setFormData({ ...formData, city: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Sức chứa</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalRooms">Số phòng chiếu</Label>
                <Input
                  id="totalRooms"
                  type="number"
                  value={formData.totalRooms}
                  onChange={(e) =>
                    setFormData({ ...formData, totalRooms: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openingHours">Giờ mở cửa</Label>
                <Input
                  id="openingHours"
                  value={formData.openingHours}
                  onChange={(e) =>
                    setFormData({ ...formData, openingHours: e.target.value })
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
                        {status === "active"
                          ? "Hoạt động"
                          : status === "inactive"
                          ? "Ngừng hoạt động"
                          : "Bảo trì"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="amenities">
                  Tiện ích (phân cách bằng dấu phẩy)
                </Label>
                <Input
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) =>
                    setFormData({ ...formData, amenities: e.target.value })
                  }
                  placeholder="IMAX, Dolby Atmos, VIP Seats, Food Court"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCreateTheater}>Thêm rạp chiếu</Button>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Ô tìm kiếm */}
            <div className="space-y-2">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Tìm theo tên, địa chỉ, thành phố..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Thành phố */}
            <div className="space-y-2">
              <Label htmlFor="city-filter">Thành phố</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả thành phố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thành phố</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <Label htmlFor="status-filter">Trạng thái</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "active"
                        ? "Hoạt động"
                        : status === "inactive"
                        ? "Ngừng hoạt động"
                        : "Bảo trì"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nút xóa bộ lọc */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCity("all");
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

      {/* Theater Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách rạp chiếu</CardTitle>
          <CardDescription>
            Hiển thị {paginatedTheaters.length} trong tổng số{" "}
            {filteredTheaters.length} rạp chiếu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên rạp chiếu</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Thành phố</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Sức chứa</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thống kê</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTheaters.map((theater) => (
                <TableRow key={theater.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{theater.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {theater.totalRooms} phòng chiếu
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{theater.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>{theater.city}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        {theater.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {theater.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{theater.capacity.toLocaleString()} chỗ</div>
                      <div className="text-muted-foreground">
                        {theater.openingHours}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(theater.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{theater.totalBookings} vé</div>
                      <div className="text-muted-foreground">
                        ${theater.revenue.toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(theater)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTheater(theater.id)}
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
              Hiển thị {startIndex + 1} đến{" "}
              {Math.min(startIndex + itemsPerPage, filteredTheaters.length)}{" "}
              trong {filteredTheaters.length} kết quả
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
              <div className="text-sm">
                Trang {currentPage} / {totalPages}
              </div>
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
            <DialogTitle>Chỉnh sửa rạp chiếu</DialogTitle>
            <DialogDescription>Cập nhật thông tin rạp chiếu</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên rạp chiếu</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-city">Thành phố</Label>
              <Select
                value={formData.city}
                onValueChange={(value) =>
                  setFormData({ ...formData, city: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-address">Địa chỉ</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Số điện thoại</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-capacity">Sức chứa</Label>
              <Input
                id="edit-capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-totalRooms">Số phòng chiếu</Label>
              <Input
                id="edit-totalRooms"
                type="number"
                value={formData.totalRooms}
                onChange={(e) =>
                  setFormData({ ...formData, totalRooms: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-openingHours">Giờ mở cửa</Label>
              <Input
                id="edit-openingHours"
                value={formData.openingHours}
                onChange={(e) =>
                  setFormData({ ...formData, openingHours: e.target.value })
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
                      {status === "active"
                        ? "Hoạt động"
                        : status === "inactive"
                        ? "Ngừng hoạt động"
                        : "Bảo trì"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-amenities">
                Tiện ích (phân cách bằng dấu phẩy)
              </Label>
              <Input
                id="edit-amenities"
                value={formData.amenities}
                onChange={(e) =>
                  setFormData({ ...formData, amenities: e.target.value })
                }
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleEditTheater}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
