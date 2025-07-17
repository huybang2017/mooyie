import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { fetchMoviesThunk } from "@/store/slices/movieSlice";
import { useDebounce } from "use-debounce";
import { getAverageRatingThunk } from "@/store/slices/commentSlice";
import { Star } from "lucide-react";

const Movies = () => {
  const dispatch = useAppDispatch();
  const { movies, loading, error } = useAppSelector((state) => state.movie);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 18;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [averageRatings, setAverageRatings] = useState<{
    [movieId: string]: number;
  }>({});

  const availableGenres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Documentary",
    "Animation",
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedGenre, selectedStatus]);

  useEffect(() => {
    dispatch(
      fetchMoviesThunk({
        page: currentPage,
        limit,
        title: debouncedSearchTerm || undefined,
        genre: selectedGenre !== "all" ? selectedGenre : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
      })
    );
  }, [
    dispatch,
    currentPage,
    debouncedSearchTerm,
    selectedGenre,
    selectedStatus,
  ]);

  useEffect(() => {
    if (movies?.data) {
      movies.data.forEach((movie) => {
        if (averageRatings[movie.id] === undefined) {
          dispatch(getAverageRatingThunk(movie.id)).then((action: any) => {
            if (
              action.payload &&
              typeof action.payload.averageRating === "number"
            ) {
              setAverageRatings((prev) => ({
                ...prev,
                [movie.id]: action.payload.averageRating,
              }));
            }
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies]);

  const totalPages = movies ? Math.ceil(movies.total / limit) : 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedGenre("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm || selectedGenre !== "all" || selectedStatus !== "all";

  return (
    <div className="px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Filters active
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Bộ lọc</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search-movie">Tìm kiếm phim</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-movie"
                  placeholder="Nhập tên phim..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {searchTerm && searchTerm !== debouncedSearchTerm && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 dark:border-green-400"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Genre filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-genre">Thể loại</Label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả thể loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thể loại</SelectItem>
                  {availableGenres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-status">Trạng thái</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="coming_soon">Sắp chiếu</SelectItem>
                  <SelectItem value="now_showing">Đang chiếu</SelectItem>
                  <SelectItem value="ended">Đã kết thúc</SelectItem>
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
                <X className="h-4 w-4 mr-2" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {movies && (
        <div className="text-sm text-muted-foreground">
          Hiển thị {movies.data.length} trong tổng số {movies.total} phim
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 dark:border-green-400"></div>
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              Đang tải...
            </span>
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {movies?.data.map((movie) => (
              <Link to={`/movies/${movie.id}`} key={movie.id}>
                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition relative">
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    {movie.status === "coming_soon" && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        Sắp chiếu
                      </Badge>
                    )}
                    {movie.status === "now_showing" && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        Đang chiếu
                      </Badge>
                    )}
                    {movie.status === "ended" && (
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      >
                        Đã kết thúc
                      </Badge>
                    )}
                  </div>

                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 truncate">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {movie.genre}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {movie.duration} min
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current text-sm" />
                      <span className="text-neutral-900 dark:text-neutral-100 text-sm">
                        {typeof averageRatings[movie.id] === "number" &&
                        !isNaN(averageRatings[movie.id])
                          ? averageRatings[movie.id].toFixed(1)
                          : "0"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Trang trước
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Trang sau
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Movies;
