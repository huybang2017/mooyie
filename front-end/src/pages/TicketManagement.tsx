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
  Ticket,
  User,
  Film,
  Calendar,
  DollarSign,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  MapPin,
  Filter,
} from "lucide-react";

interface TicketData {
  id: string;
  ticketNumber: string;
  movieTitle: string;
  theaterName: string;
  roomNumber: string;
  showtime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  seatNumber: string;
  price: number;
  status: "confirmed" | "cancelled" | "used" | "expired";
  bookingDate: string;
  paymentMethod: "cash" | "card" | "online" | "momo";
  bookingCode: string;
  notes?: string;
}

interface TicketFormData {
  ticketNumber: string;
  movieTitle: string;
  theaterName: string;
  roomNumber: string;
  showtime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  seatNumber: string;
  price: string;
  status: string;
  bookingDate: string;
  paymentMethod: string;
  bookingCode: string;
  notes: string;
}

const fakeTickets: TicketData[] = [
  {
    id: "1",
    ticketNumber: "TK001234",
    movieTitle: "Inception",
    theaterName: "CGV Aeon Mall",
    roomNumber: "Phòng 1",
    showtime: "2024-01-15 20:00",
    customerName: "Nguyễn Văn An",
    customerEmail: "nguyenvanan@email.com",
    customerPhone: "0901234567",
    seatNumber: "A12",
    price: 85000,
    status: "confirmed",
    bookingDate: "2024-01-14 15:30",
    paymentMethod: "online",
    bookingCode: "BC001234",
    notes: "Khách hàng VIP",
  },
  {
    id: "2",
    ticketNumber: "TK001235",
    movieTitle: "The Dark Knight",
    theaterName: "Lotte Cinema Diamond",
    roomNumber: "Phòng 3",
    showtime: "2024-01-15 19:30",
    customerName: "Trần Thị Bình",
    customerEmail: "tranthibinh@email.com",
    customerPhone: "0901234568",
    seatNumber: "B15",
    price: 95000,
    status: "used",
    bookingDate: "2024-01-14 16:45",
    paymentMethod: "card",
    bookingCode: "BC001235",
  },
  {
    id: "3",
    ticketNumber: "TK001236",
    movieTitle: "Interstellar",
    theaterName: "Galaxy Cinema Nguyễn Du",
    roomNumber: "Phòng 2",
    showtime: "2024-01-15 21:00",
    customerName: "Lê Văn Cường",
    customerEmail: "levancuong@email.com",
    customerPhone: "0901234569",
    seatNumber: "C08",
    price: 75000,
    status: "cancelled",
    bookingDate: "2024-01-14 17:20",
    paymentMethod: "momo",
    bookingCode: "BC001236",
    notes: "Khách hủy vé",
  },
  {
    id: "4",
    ticketNumber: "TK001237",
    movieTitle: "Avengers: Endgame",
    theaterName: "BHD Star Bitexco",
    roomNumber: "Phòng 4",
    showtime: "2024-01-15 18:00",
    customerName: "Phạm Thị Dung",
    customerEmail: "phamthidung@email.com",
    customerPhone: "0901234570",
    seatNumber: "D20",
    price: 120000,
    status: "confirmed",
    bookingDate: "2024-01-14 18:10",
    paymentMethod: "cash",
    bookingCode: "BC001237",
  },
  {
    id: "5",
    ticketNumber: "TK001238",
    movieTitle: "Joker",
    theaterName: "CGV Crescent Mall",
    roomNumber: "Phòng 1",
    showtime: "2024-01-15 22:30",
    customerName: "Hoàng Văn Em",
    customerEmail: "hoangvanem@email.com",
    customerPhone: "0901234571",
    seatNumber: "E05",
    price: 85000,
    status: "expired",
    bookingDate: "2024-01-14 19:00",
    paymentMethod: "online",
    bookingCode: "BC001238",
  },
  {
    id: "6",
    ticketNumber: "TK001239",
    movieTitle: "Parasite",
    theaterName: "Lotte Cinema Landmark",
    roomNumber: "Phòng 5",
    showtime: "2024-01-15 20:30",
    customerName: "Vũ Thị Phương",
    customerEmail: "vuthiphuong@email.com",
    customerPhone: "0901234572",
    seatNumber: "F12",
    price: 90000,
    status: "confirmed",
    bookingDate: "2024-01-14 20:15",
    paymentMethod: "card",
    bookingCode: "BC001239",
  },
  {
    id: "7",
    ticketNumber: "TK001240",
    movieTitle: "Spider-Man: No Way Home",
    theaterName: "CGV Aeon Mall",
    roomNumber: "Phòng 2",
    showtime: "2024-01-15 19:00",
    customerName: "Đỗ Văn Giang",
    customerEmail: "dovangiang@email.com",
    customerPhone: "0901234573",
    seatNumber: "G18",
    price: 110000,
    status: "used",
    bookingDate: "2024-01-14 21:30",
    paymentMethod: "momo",
    bookingCode: "BC001240",
  },
  {
    id: "8",
    ticketNumber: "TK001241",
    movieTitle: "The Matrix",
    theaterName: "BHD Star Bitexco",
    roomNumber: "Phòng 3",
    showtime: "2024-01-15 21:30",
    customerName: "Ngô Thị Hoa",
    customerEmail: "ngothihoa@email.com",
    customerPhone: "0901234574",
    seatNumber: "H03",
    price: 80000,
    status: "confirmed",
    bookingDate: "2024-01-14 22:00",
    paymentMethod: "online",
    bookingCode: "BC001241",
  },
];

const theaters = [
  "CGV Aeon Mall",
  "Lotte Cinema Diamond",
  "Galaxy Cinema Nguyễn Du",
  "BHD Star Bitexco",
  "CGV Crescent Mall",
  "Lotte Cinema Landmark",
];
const statuses = ["confirmed", "cancelled", "used", "expired"];
const paymentMethods = ["cash", "card", "online", "momo"];

export default function TicketManagement() {
  const [tickets, setTickets] = useState<TicketData[]>(fakeTickets);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState<TicketFormData>({
    ticketNumber: "",
    movieTitle: "",
    theaterName: "",
    roomNumber: "",
    showtime: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    seatNumber: "",
    price: "",
    status: "confirmed",
    bookingDate: "",
    paymentMethod: "online",
    bookingCode: "",
    notes: "",
  });

  const handleCreateTicket = () => {
    const newTicket: TicketData = {
      id: Date.now().toString(),
      ticketNumber: formData.ticketNumber,
      movieTitle: formData.movieTitle,
      theaterName: formData.theaterName,
      roomNumber: formData.roomNumber,
      showtime: formData.showtime,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      seatNumber: formData.seatNumber,
      price: parseFloat(formData.price),
      status: formData.status as "confirmed" | "cancelled" | "used" | "expired",
      bookingDate: formData.bookingDate,
      paymentMethod: formData.paymentMethod as
        | "cash"
        | "card"
        | "online"
        | "momo",
      bookingCode: formData.bookingCode,
      notes: formData.notes || undefined,
    };
    setTickets([...tickets, newTicket]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditTicket = () => {
    if (editingTicket) {
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === editingTicket.id
          ? { ...ticket, ...formData, price: parseFloat(formData.price) }
          : ticket
      );
      setTickets(updatedTickets);
      setIsEditDialogOpen(false);
      setEditingTicket(null);
      resetForm();
    }
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(tickets.filter((ticket) => ticket.id !== id));
  };

  const openEditDialog = (ticket: TicketData) => {
    setEditingTicket(ticket);
    setFormData({
      ticketNumber: ticket.ticketNumber,
      movieTitle: ticket.movieTitle,
      theaterName: ticket.theaterName,
      roomNumber: ticket.roomNumber,
      showtime: ticket.showtime,
      customerName: ticket.customerName,
      customerEmail: ticket.customerEmail,
      customerPhone: ticket.customerPhone,
      seatNumber: ticket.seatNumber,
      price: ticket.price.toString(),
      status: ticket.status,
      bookingDate: ticket.bookingDate,
      paymentMethod: ticket.paymentMethod,
      bookingCode: ticket.bookingCode,
      notes: ticket.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      ticketNumber: "",
      movieTitle: "",
      theaterName: "",
      roomNumber: "",
      showtime: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      seatNumber: "",
      price: "",
      status: "confirmed",
      bookingDate: "",
      paymentMethod: "online",
      bookingCode: "",
      notes: "",
    });
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.bookingCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheater =
      selectedTheater === "all" || ticket.theaterName === selectedTheater;
    const matchesStatus =
      selectedStatus === "all" || ticket.status === selectedStatus;
    const matchesPaymentMethod =
      selectedPaymentMethod === "all" ||
      ticket.paymentMethod === selectedPaymentMethod;
    return (
      matchesSearch && matchesTheater && matchesStatus && matchesPaymentMethod
    );
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Đã xác nhận
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Đã hủy
          </Badge>
        );
      case "used":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Đã sử dụng
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Hết hạn
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "cash":
        return <Badge variant="outline">Tiền mặt</Badge>;
      case "card":
        return <Badge variant="outline">Thẻ</Badge>;
      case "online":
        return <Badge variant="outline">Online</Badge>;
      case "momo":
        return <Badge variant="outline">MoMo</Badge>;
      default:
        return <Badge variant="secondary">{method}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý vé</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách vé và thông tin đặt vé
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm vé
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm vé mới</DialogTitle>
              <DialogDescription>Nhập thông tin vé mới</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticketNumber">Mã vé</Label>
                <Input
                  id="ticketNumber"
                  value={formData.ticketNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, ticketNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookingCode">Mã đặt vé</Label>
                <Input
                  id="bookingCode"
                  value={formData.bookingCode}
                  onChange={(e) =>
                    setFormData({ ...formData, bookingCode: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="movieTitle">Tên phim</Label>
                <Input
                  id="movieTitle"
                  value={formData.movieTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, movieTitle: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theaterName">Rạp chiếu</Label>
                <Select
                  value={formData.theaterName}
                  onValueChange={(value) =>
                    setFormData({ ...formData, theaterName: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn rạp chiếu" />
                  </SelectTrigger>
                  <SelectContent>
                    {theaters.map((theater) => (
                      <SelectItem key={theater} value={theater}>
                        {theater}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Phòng chiếu</Label>
                <Input
                  id="roomNumber"
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, roomNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="showtime">Suất chiếu</Label>
                <Input
                  id="showtime"
                  type="datetime-local"
                  value={formData.showtime}
                  onChange={(e) =>
                    setFormData({ ...formData, showtime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Tên khách hàng</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Số điện thoại</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seatNumber">Số ghế</Label>
                <Input
                  id="seatNumber"
                  value={formData.seatNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, seatNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Giá vé</Label>
                <Input
                  id="price"
                  type="number"
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
                        {status === "confirmed"
                          ? "Đã xác nhận"
                          : status === "cancelled"
                          ? "Đã hủy"
                          : status === "used"
                          ? "Đã sử dụng"
                          : "Hết hạn"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookingDate">Ngày đặt vé</Label>
                <Input
                  id="bookingDate"
                  type="datetime-local"
                  value={formData.bookingDate}
                  onChange={(e) =>
                    setFormData({ ...formData, bookingDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phương thức" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method === "cash"
                          ? "Tiền mặt"
                          : method === "card"
                          ? "Thẻ"
                          : method === "online"
                          ? "Online"
                          : "MoMo"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
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
              <Button onClick={handleCreateTicket}>Thêm vé</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Bộ lọc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Tìm kiếm */}
            <div className="space-y-2">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Tìm theo mã vé, tên phim, khách hàng, mã đặt vé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Rạp chiếu */}
            <div className="space-y-2">
              <Label htmlFor="theater-filter">Rạp chiếu</Label>
              <Select
                value={selectedTheater}
                onValueChange={setSelectedTheater}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả rạp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả rạp</SelectItem>
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
              <Label htmlFor="status-filter">Trạng thái</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "confirmed"
                        ? "Đã xác nhận"
                        : status === "cancelled"
                        ? "Đã hủy"
                        : status === "used"
                        ? "Đã sử dụng"
                        : "Hết hạn"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Phương thức thanh toán */}
            <div className="space-y-2">
              <Label htmlFor="payment-filter">Thanh toán</Label>
              <Select
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả phương thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phương thức</SelectItem>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method === "cash"
                        ? "Tiền mặt"
                        : method === "card"
                        ? "Thẻ"
                        : method === "online"
                        ? "Online"
                        : "MoMo"}
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
                  setSelectedTheater("all");
                  setSelectedStatus("all");
                  setSelectedPaymentMethod("all");
                }}
                className="w-full"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách vé</CardTitle>
          <CardDescription>
            Hiển thị {paginatedTickets.length} trong tổng số{" "}
            {filteredTickets.length} vé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã vé</TableHead>
                <TableHead>Thông tin phim</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Suất chiếu</TableHead>
                <TableHead>Ghế & Giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ticket.ticketNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {ticket.bookingCode}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ticket.movieTitle}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {ticket.theaterName} - {ticket.roomNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ticket.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {ticket.customerEmail}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {ticket.customerPhone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(ticket.showtime).toLocaleString("vi-VN")}
                      </div>
                      <div className="text-muted-foreground">
                        Đặt:{" "}
                        {new Date(ticket.bookingDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">Ghế {ticket.seatNumber}</div>
                      <div className="text-muted-foreground">
                        ${ticket.price.toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>
                    {getPaymentMethodBadge(ticket.paymentMethod)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(ticket)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTicket(ticket.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị {startIndex + 1} đến{" "}
              {Math.min(startIndex + itemsPerPage, filteredTickets.length)}{" "}
              trong {filteredTickets.length} kết quả
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa vé</DialogTitle>
            <DialogDescription>Cập nhật thông tin vé</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-ticketNumber">Mã vé</Label>
              <Input
                id="edit-ticketNumber"
                value={formData.ticketNumber}
                onChange={(e) =>
                  setFormData({ ...formData, ticketNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bookingCode">Mã đặt vé</Label>
              <Input
                id="edit-bookingCode"
                value={formData.bookingCode}
                onChange={(e) =>
                  setFormData({ ...formData, bookingCode: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-movieTitle">Tên phim</Label>
              <Input
                id="edit-movieTitle"
                value={formData.movieTitle}
                onChange={(e) =>
                  setFormData({ ...formData, movieTitle: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-theaterName">Rạp chiếu</Label>
              <Select
                value={formData.theaterName}
                onValueChange={(value) =>
                  setFormData({ ...formData, theaterName: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {theaters.map((theater) => (
                    <SelectItem key={theater} value={theater}>
                      {theater}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-roomNumber">Phòng chiếu</Label>
              <Input
                id="edit-roomNumber"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-showtime">Suất chiếu</Label>
              <Input
                id="edit-showtime"
                type="datetime-local"
                value={formData.showtime}
                onChange={(e) =>
                  setFormData({ ...formData, showtime: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-customerName">Tên khách hàng</Label>
              <Input
                id="edit-customerName"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-customerEmail">Email</Label>
              <Input
                id="edit-customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-customerPhone">Số điện thoại</Label>
              <Input
                id="edit-customerPhone"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-seatNumber">Số ghế</Label>
              <Input
                id="edit-seatNumber"
                value={formData.seatNumber}
                onChange={(e) =>
                  setFormData({ ...formData, seatNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Giá vé</Label>
              <Input
                id="edit-price"
                type="number"
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
                      {status === "confirmed"
                        ? "Đã xác nhận"
                        : status === "cancelled"
                        ? "Đã hủy"
                        : status === "used"
                        ? "Đã sử dụng"
                        : "Hết hạn"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bookingDate">Ngày đặt vé</Label>
              <Input
                id="edit-bookingDate"
                type="datetime-local"
                value={formData.bookingDate}
                onChange={(e) =>
                  setFormData({ ...formData, bookingDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-paymentMethod">Phương thức thanh toán</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method === "cash"
                        ? "Tiền mặt"
                        : method === "card"
                        ? "Thẻ"
                        : method === "online"
                        ? "Online"
                        : "MoMo"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-notes">Ghi chú</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
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
            <Button onClick={handleEditTicket}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
