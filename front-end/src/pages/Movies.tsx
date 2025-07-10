import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fetchMoviesThunk } from "@/store/slices/movieSlice";

const Movies = () => {
  const dispatch = useAppDispatch();
  const { movies, loading, error } = useAppSelector((state) => state.movie);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;

  useEffect(() => {
    dispatch(fetchMoviesThunk({ page: currentPage, limit }));
  }, [dispatch, currentPage]);

  const totalPages = movies ? Math.ceil(movies.total / limit) : 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="px-4">
      <h1 className="text-3xl font-bold mb-6">Movies</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies?.data.map((movie) => (
              <Link to={`/movies/${movie.id}`} key={movie.id}>
                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {movie.genre}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {movie.duration} min
                    </p>
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
