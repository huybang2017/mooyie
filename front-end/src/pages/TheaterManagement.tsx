import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
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
import { MapPin, Edit, Filter } from "lucide-react";
import type { Theater } from "@/services/type";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTheatersAdminThunk } from "@/store/slices/theaterSlice";
import { CreateTheaterForm } from "@/components/CreateTheaterForm";
import { UpdateTheaterForm } from "@/components/UpdateTheaterForm";
import { Badge } from "@/components/ui/badge";

const logo = ["CGV", "Galaxy", "BHD", "Lotte", "Mega"];

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

export default function TheaterManagement() {
  const dispatch = useAppDispatch();
  const { adminTheaters, loading } = useAppSelector((state) => state.theater);

  // Filters
  const [filterName, setFilterName] = useState("");
  const [debouncedFilterName] = useDebounce(filterName, 500);
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"active" | "inactive" | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Dialog state
  const [editingTheater, setEditingTheater] = useState<Theater | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch theaters on mount and when filters/page change
  useEffect(() => {
    dispatch(
      fetchTheatersAdminThunk({
        page: currentPage,
        limit: itemsPerPage,
        name: debouncedFilterName || undefined,
        brand: filterBrand === "all" ? undefined : filterBrand,
        status: filterStatus === "all" ? undefined : (filterStatus as "active" | "inactive"),
      })
    );
  }, [dispatch, currentPage, itemsPerPage, debouncedFilterName, filterBrand, filterStatus]);

  // Get data from Redux
  const theaters = adminTheaters?.data || [];
  const total = adminTheaters?.total || 0;
  const totalPages = adminTheaters?.totalPages || 1;

  // Filter UI handlers
  const handleClearFilters = () => {
    setFilterName("");
    setFilterBrand("all");
    setFilterStatus("all");
    setCurrentPage(1);
  };

  // Edit dialog handlers
  const openEditDialog = (theater: Theater) => {
    setEditingTheater(theater);
    setIsEditDialogOpen(true);
  };
  const closeEditDialog = () => {
    setEditingTheater(null);
    setIsEditDialogOpen(false);
  };
  const handleEditSuccess = () => {
    closeEditDialog();
    dispatch(
      fetchTheatersAdminThunk({
        page: currentPage,
        limit: itemsPerPage,
        name: debouncedFilterName || undefined,
        brand: filterBrand === "all" ? undefined : filterBrand,
        status: filterStatus === "all" ? undefined : (filterStatus as "active" | "inactive"),
      })
    );
  };
  const handleCreateSuccess = () => {
    dispatch(
      fetchTheatersAdminThunk({
        page: currentPage,
        limit: itemsPerPage,
        name: debouncedFilterName || undefined,
        brand: filterBrand === "all" ? undefined : filterBrand,
        status: filterStatus === "all" ? undefined : (filterStatus as "active" | "inactive"),
      })
    );
  };

  // Add refresh handler
  const handleRefresh = () => {
    dispatch(
      fetchTheatersAdminThunk({
        page: currentPage,
        limit: itemsPerPage,
        name: debouncedFilterName || undefined,
        brand: filterBrand === "all" ? undefined : filterBrand,
        status: filterStatus === "all" ? undefined : (filterStatus as "active" | "inactive"),
      })
    );
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
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            Làm mới
          </Button>
          <CreateTheaterForm onSuccess={handleCreateSuccess} />
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Name filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-name">Tìm kiếm</Label>
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filter-name"
                  placeholder="Tìm theo tên rạp chiếu..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="pl-10"
                />
                {filterName !== debouncedFilterName && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 dark:border-green-400"></div>
                  </div>
                )}
              </div>
            </div>
            {/* Brand filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-brand">Thương hiệu</Label>
              <Select value={filterBrand} onValueChange={setFilterBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                  {logo.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Status filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-status">Trạng thái</Label>
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value as "active" | "inactive" | "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {/* Theater Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách rạp chiếu</CardTitle>
          <CardDescription>
            Hiển thị {theaters.length} trong tổng số {total} rạp chiếu
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
                <TableHead>Tên rạp chiếu</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Thương hiệu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Số phòng</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {theaters.map((theater) => (
                <TableRow key={theater.id}>
                  <TableCell>
                    <div className="font-medium flex items-center gap-2">
                      {theater.brandLogo && (
                        <img
                          src={theater.brandLogo}
                          alt={theater.brand}
                          className="h-5 w-5 rounded"
                        />
                      )}
                      {theater.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{theater.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>{theater.brand}</TableCell>
                  <TableCell>
                    {theater.status === "active" ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hoạt động</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Ngừng hoạt động</Badge>
                    )}
                  </TableCell>
                  <TableCell>{theater.rooms?.length}</TableCell>
                  <TableCell>
                    {new Date(theater.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(theater)}
                      >
                        <Edit className="h-4 w-4" />
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
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
              {Math.min(currentPage * itemsPerPage, total)} trong {total}{" "}
              kết quả
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
      <UpdateTheaterForm
        theater={editingTheater}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
