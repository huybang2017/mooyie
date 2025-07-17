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
import { Checkbox } from "@/components/ui/checkbox";

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
import {
  Search,
  Filter,
  Trash2,
  Clock,
  Star,
  Bookmark,
  Calendar,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  fetchAdminMoviesThunk,
  deleteMovieThunk,
} from "@/store/slices/movieSlice";
import { CreateMovieForm } from "@/components/CreateMovieForm";
import { UpdateMovieForm } from "@/components/UpdateMovieForm";
import { ActionConfirmationDialog } from "@/components/ActionConfirmationDialog";
import { MovieActionMenu } from "@/components/MovieActionMenu";
import { BulkActionConfirmation } from "@/components/BulkActionConfirmation";
import type { Movie } from "@/services/type";
import { toast } from "sonner";
import { getAverageRatingThunk } from "@/store/slices/commentSlice";

const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Documentary",
];
const statuses = ["now_showing", "coming_soon", "ended"];

const MovieManagement = () => {
  const dispatch = useAppDispatch();
  const { adminMovies, loading, error } = useAppSelector(
    (state) => state.movie
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [editingMovie, setEditingMovie] = useState<any>(null);
  const [deletingMovie, setDeletingMovie] = useState<any>(null);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [bulkAction, setBulkAction] = useState<"delete" | "update">("delete");
  const [isLoadingBulkAction, setIsLoadingBulkAction] = useState(false);
  const [averageRatings, setAverageRatings] = useState<{ [movieId: string]: number }>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(
      fetchAdminMoviesThunk({
        page: currentPage,
        limit: itemsPerPage,
        genre: selectedGenre === "all" ? undefined : selectedGenre,
        title: debouncedSearchTerm || undefined,
        status: selectedStatus === "all" ? undefined : selectedStatus,
      })
    );
  }, [
    dispatch,
    currentPage,
    itemsPerPage,
    selectedGenre,
    debouncedSearchTerm,
    selectedStatus,
  ]);

  useEffect(() => {
    if (adminMovies?.data) {
      adminMovies.data.forEach((movie) => {
        if (averageRatings[movie.id] === undefined) {
          dispatch(getAverageRatingThunk(movie.id)).then((action: any) => {
            if (action.payload && typeof action.payload.averageRating === "number") {
              setAverageRatings((prev) => ({ ...prev, [movie.id]: action.payload.averageRating }));
            }
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminMovies?.data]);

  const handleRefresh = () => {
    dispatch(
      fetchAdminMoviesThunk({
        page: currentPage,
        limit: itemsPerPage,
        genre: selectedGenre === "all" ? undefined : selectedGenre,
        title: debouncedSearchTerm || undefined,
        status: selectedStatus === "all" ? undefined : selectedStatus,
      })
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    dispatch(
      fetchAdminMoviesThunk({
        page: newPage,
        limit: itemsPerPage,
        genre: selectedGenre === "all" ? undefined : selectedGenre,
        title: debouncedSearchTerm || undefined,
        status: selectedStatus === "all" ? undefined : selectedStatus,
      })
    );
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset to first page when filters change
    dispatch(
      fetchAdminMoviesThunk({
        page: 1,
        limit: itemsPerPage,
        genre: selectedGenre === "all" ? undefined : selectedGenre,
        title: debouncedSearchTerm || undefined,
        status: selectedStatus === "all" ? undefined : selectedStatus,
      })
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle search term changes and reset pagination
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handleDeleteMovie = (movie: any) => {
    setDeletingMovie(movie);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteMovie = async () => {
    if (!deletingMovie) return;

    try {
      await dispatch(deleteMovieThunk(deletingMovie.id)).unwrap();
      toast.success("Ẩn phim thành công");
      setIsDeleteDialogOpen(false);
      setDeletingMovie(null);
      handleRefresh();
    } catch (error: any) {
      toast.error(error || "Có lỗi xảy ra khi xóa phim");
    }
  };

  const handleBulkAction = (action: "delete" | "update") => {
    if (selectedMovies.length === 0) {
      toast.error("Vui lòng chọn ít nhất một phim");
      return;
    }
    setBulkAction(action);
    setIsBulkActionDialogOpen(true);
  };

  const confirmBulkAction = async () => {
    setIsLoadingBulkAction(true);
    try {
      switch (bulkAction) {
        case "delete":
          // Implement bulk delete
          for (const movie of selectedMovies) {
            await dispatch(deleteMovieThunk(movie.id)).unwrap();
          }
          toast.success(`Đã xóa ${selectedMovies.length} phim thành công`);
          break;
        case "update":
          // Implement bulk update (placeholder)
          toast.success(`Đã cập nhật ${selectedMovies.length} phim thành công`);
          break;
      }
      setSelectedMovies([]);
      setIsBulkActionDialogOpen(false);
      handleRefresh();
    } catch (error: any) {
      toast.error(error || "Có lỗi xảy ra khi thực hiện hành động");
    } finally {
      setIsLoadingBulkAction(false);
    }
  };

  const handleCopyLink = (movie: any) => {
    const url = `${window.location.origin}/movies/${movie.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Đã sao chép link phim");
  };

  const openDetailDialog = (movie: any) => {
    setSelectedMovie(movie);
    setIsDetailDialogOpen(true);
  };

  const openUpdateDialog = (movie: any) => {
    setEditingMovie(movie);
    setIsUpdateDialogOpen(true);
  };

  // Calculate average rating from comments
  const calculateAverageRating = (comments: any[]) => {
    if (!comments || comments.length === 0) return 0;
    const totalRating = comments.reduce(
      (sum, comment) => sum + comment.rating,
      0
    );
    return (totalRating / comments.length).toFixed(1);
  };

  // Use server-side pagination data from API response
  const totalPages = adminMovies?.totalPages || 1;
  const totalItems = adminMovies?.total || 0;
  const currentPageFromApi = adminMovies?.currentPage || 1;
  const pageSize = adminMovies?.pageSize || itemsPerPage;
  const hasNextPage = adminMovies?.hasNextPage || false;
  const hasPreviousPage = adminMovies?.hasPreviousPage || false;

  // Use data directly from API response (server-side filtering)
  const movies = adminMovies?.data || [];

  const handleSelectMovie = (movie: any, checked: boolean) => {
    if (checked) {
      setSelectedMovies((prev) => [...prev, movie]);
    } else {
      setSelectedMovies((prev) => prev.filter((m) => m.id !== movie.id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMovies(movies);
    } else {
      setSelectedMovies([]);
    }
  };

  const isAllSelected =
    movies.length > 0 && selectedMovies.length === movies.length;
  const isIndeterminate =
    selectedMovies.length > 0 && selectedMovies.length < movies.length;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "now_showing":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200">
            Đang chiếu
          </Badge>
        );
      case "coming_soon":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200">
            Sắp chiếu
          </Badge>
        );
      case "ended":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-200">
            Đã kết thúc
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý phim</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách phim và thông tin chi tiết
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            Làm mới
          </Button>
          <CreateMovieForm
            onSuccess={() => {
              toast.success("Tạo phim thành công");
              handleRefresh();
            }}
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedMovies.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  {selectedMovies.length} phim đã chọn
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa hàng loạt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            <div className="space-y-2">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Tìm theo tên hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
                {searchTerm !== debouncedSearchTerm && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 dark:border-green-400"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre-filter">Thể loại</Label>
              <Select
                value={selectedGenre}
                onValueChange={(value) => {
                  setSelectedGenre(value);
                  handleFilterChange();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả thể loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thể loại</SelectItem>
                  {genres
                    .filter((genre) => genre !== "")
                    .map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status-filter">Trạng thái</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => {
                  setSelectedStatus(value);
                  handleFilterChange();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
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
                  setSelectedGenre("all");
                  setSelectedStatus("all");
                  handleFilterChange();
                }}
                className="w-full"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movie Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách phim</CardTitle>
          <CardDescription>
            Hiển thị {movies.length} trong tổng số {totalItems} phim
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
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Poster</TableHead>
                <TableHead>Tên phim</TableHead>
                <TableHead>Thể loại</TableHead>
                <TableHead>Thời lượng</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Trailer</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Đặt vé</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedMovies.some((m) => m.id === movie.id)}
                      onCheckedChange={(checked) =>
                        handleSelectMovie(movie, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">
                        {movie.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(movie.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{movie.genre}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                      <span className="text-neutral-900 dark:text-neutral-100">
                        {movie.duration} phút
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-neutral-900 dark:text-neutral-100">
                        {typeof averageRatings[movie.id] === "number" && !isNaN(averageRatings[movie.id])
                          ? averageRatings[movie.id].toFixed(1)
                          : "0"}
                        /5
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {movie.trailer_url ? (
                      <a
                        href={movie.trailer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm underline"
                      >
                        Xem trailer
                      </a>
                    ) : (
                      <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                        Không có
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {movie.status ? (
                      getStatusBadge(movie.status)
                    ) : (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-neutral-900 dark:text-neutral-100">
                        {movie.showtimes?.length || 0} suất chiếu
                      </div>
                      <div className="text-muted-foreground">
                        {movie.bookmarks?.length || 0} bookmark
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <MovieActionMenu
                      movie={movie}
                      onView={openDetailDialog}
                      onEdit={openUpdateDialog}
                      onDelete={handleDeleteMovie}
                      onCopyLink={handleCopyLink}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị {movies.length} trong tổng số {totalItems} kết quả
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={!hasPreviousPage || loading}
              >
                Trước
              </Button>
              <div className="text-sm">
                Trang {currentPageFromApi} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={!hasNextPage || loading}
              >
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movie Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="min-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết phim</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về phim và các dữ liệu liên quan
            </DialogDescription>
          </DialogHeader>

          {selectedMovie && (
            <div className="space-y-6">
              {/* Movie Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Movie Poster */}
                <div className="space-y-4">
                  <img
                    src={selectedMovie.image}
                    alt={selectedMovie.title}
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                  <div className="flex justify-center">
                    {selectedMovie.status ? (
                      getStatusBadge(selectedMovie.status)
                    ) : (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Movie Details */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      {selectedMovie.title}
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                      ID: {selectedMovie.id}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Thể loại
                      </Label>
                      <p className="text-neutral-900 dark:text-neutral-100">
                        {selectedMovie.genre}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Thời lượng
                      </Label>
                      <p className="text-neutral-900 dark:text-neutral-100">
                        {selectedMovie.duration} phút
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Ngày tạo
                      </Label>
                      <p className="text-neutral-900 dark:text-neutral-100">
                        {new Date(selectedMovie.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Trạng thái
                      </Label>
                      <p className="text-neutral-900 dark:text-neutral-100 capitalize">
                        {selectedMovie.status || "active"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Đánh giá trung bình
                      </Label>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i <
                                Math.floor(
                                  Number(
                                    calculateAverageRating(
                                      selectedMovie.comments || []
                                    )
                                  )
                                )
                                  ? "text-yellow-400 fill-current"
                                  : "text-neutral-300 dark:text-neutral-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                          {calculateAverageRating(selectedMovie.comments || [])}
                          /5
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          ({selectedMovie.comments?.length || 0} đánh giá)
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Trailer URL
                      </Label>
                      <p className="text-neutral-900 dark:text-neutral-100">
                        {selectedMovie.trailer_url ? (
                          <a
                            href={selectedMovie.trailer_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 dark:text-green-400 hover:underline"
                          >
                            Xem trailer
                          </a>
                        ) : (
                          "Không có trailer"
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Mô tả
                    </Label>
                    <p className="text-neutral-900 dark:text-neutral-100 mt-1 leading-relaxed">
                      {selectedMovie.description || "Không có mô tả"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                          Suất chiếu
                        </p>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                          {selectedMovie.showtimes?.length || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <div>
                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                          Đánh giá
                        </p>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                          {calculateAverageRating(selectedMovie.comments || [])}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {selectedMovie.comments?.length || 0} bình luận
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Bookmark className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                          Bookmark
                        </p>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                          {selectedMovie.bookmarks?.length || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                          Ngày tạo
                        </p>
                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {new Date(selectedMovie.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Showtimes Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Suất chiếu
                  </h3>
                  <Badge variant="outline">
                    {selectedMovie.showtimes?.length || 0} suất
                  </Badge>
                </div>

                {selectedMovie.showtimes &&
                selectedMovie.showtimes.length > 0 ? (
                  <div className="space-y-3">
                    {selectedMovie.showtimes.map(
                      (showtime: any, index: number) => (
                        <Card key={showtime.id || index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                  Phòng: {showtime.room?.name || "N/A"}
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  Rạp: {showtime.room?.theater?.name || "N/A"}
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  Trạng thái:{" "}
                                  {showtime.isActive
                                    ? "Hoạt động"
                                    : "Không hoạt động"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  {new Date(
                                    showtime.createdAt
                                  ).toLocaleDateString("vi-VN")}
                                </p>
                                <Badge
                                  variant={
                                    showtime.isActive ? "default" : "secondary"
                                  }
                                >
                                  {showtime.isActive
                                    ? "Hoạt động"
                                    : "Không hoạt động"}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-neutral-500 dark:text-neutral-400">
                        Chưa có suất chiếu nào
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Đánh giá & Bình luận
                  </h3>
                  <Badge variant="outline">
                    {selectedMovie.comments?.length || 0} bình luận
                  </Badge>
                </div>

                {selectedMovie.comments && selectedMovie.comments.length > 0 ? (
                  <div className="space-y-3">
                    {selectedMovie.comments.map(
                      (comment: any, index: number) => (
                        <Card key={comment.id || index}>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-neutral-300 dark:bg-neutral-600 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    {comment.user?.name?.charAt(0) || "U"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                    {comment.user?.name || "Người dùng"}
                                  </p>
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < comment.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-neutral-300 dark:text-neutral-600"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {comment.rating}/5
                                  </Badge>
                                </div>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
                                  {comment.content}
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                  {new Date(
                                    comment.createdAt
                                  ).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-neutral-500 dark:text-neutral-400">
                        Chưa có bình luận nào
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Bookmarks Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Bookmarks
                  </h3>
                  <Badge variant="outline">
                    {selectedMovie.bookmarks?.length || 0} bookmark
                  </Badge>
                </div>

                {selectedMovie.bookmarks &&
                selectedMovie.bookmarks.length > 0 ? (
                  <div className="space-y-3">
                    {selectedMovie.bookmarks.map(
                      (bookmark: any, index: number) => (
                        <Card key={bookmark.id || index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                  <Bookmark className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                    User: {bookmark.user.name || "N/A"}
                                  </p>
                                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {new Date(
                                      bookmark.createdAt
                                    ).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-neutral-500 dark:text-neutral-400">
                        Chưa có bookmark nào
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Đóng
            </Button>
            {selectedMovie && (
              <Button
                onClick={() => {
                  setIsDetailDialogOpen(false);
                  openUpdateDialog(selectedMovie);
                }}
              >
                Chỉnh sửa phim
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Movie Dialog */}
      <UpdateMovieForm
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        movie={editingMovie}
        onSuccess={() => {
          setIsUpdateDialogOpen(false);
          setEditingMovie(null);
          toast.success("Cập nhật phim thành công");
          handleRefresh();
        }}
      />

      {/* Action Confirmation Dialogs */}
      <ActionConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xác nhận xóa phim"
        description={`Bạn có chắc chắn muốn xóa phim "${deletingMovie?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa phim"
        variant="destructive"
        icon={<Trash2 className="h-5 w-5" />}
        onConfirm={confirmDeleteMovie}
        onCancel={() => setDeletingMovie(null)}
      />

      {/* Bulk Action Confirmation Dialog */}
      <BulkActionConfirmation
        open={isBulkActionDialogOpen}
        onOpenChange={setIsBulkActionDialogOpen}
        action={bulkAction}
        selectedMovies={selectedMovies}
        onConfirm={confirmBulkAction}
        loading={isLoadingBulkAction}
      />
    </div>
  );
};

export default MovieManagement;
