import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Ticket } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMoviesThunk } from "@/store/slices/movieSlice";

const Home = () => {
  const dispatch = useAppDispatch();
  const { movies, loading } = useAppSelector((state) => state.movie);
  const [nowShowing, setNowShowing] = useState<any[]>([]);
  const [comingSoon, setComingSoon] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMoviesThunk({ page: 1, limit: 20 }));
  }, [dispatch]);

  useEffect(() => {
    if (movies?.data) {
      setNowShowing(movies.data.filter((m: any) => m.status === "now_showing"));
      setComingSoon(movies.data.filter((m: any) => m.status === "coming_soon"));
    }
  }, [movies]);

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-8">
      <div className="max-w-5xl w-full space-y-8 text-center mb-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            <span className="text-primary">Mooyie</span> – Book Movie Tickets
          </h1>
          <p className="text-lg text-muted-foreground">
            Experience a modern, fast, and convenient movie ticket booking
            platform.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link to="/movies">
            <Button size="lg" className="gap-2">
              <Film className="w-5 h-5" />
              Browse Movies
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg" className="gap-2">
              <Ticket className="w-5 h-5" />
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Section: Phim đang chiếu */}
      <div className="w-full max-w-5xl mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Phim đang chiếu</h2>
          <Button
            variant="link"
            onClick={() => navigate("/movies?status=now_showing")}
          >
            All
          </Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            Đang tải...
          </div>
        ) : nowShowing.length === 0 ? (
          <div className="text-muted-foreground text-center">
            Không có phim đang chiếu.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {nowShowing.slice(0, 4).map((movie) => (
              <Link to={`/movies/${movie.id}`} key={movie.id}>
                <Card className="overflow-hidden hover:shadow-lg transition relative py-0">
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Đang chiếu
                    </Badge>
                  </div>
                  <CardContent className="p-0">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <div className="font-semibold truncate mb-1">
                        {movie.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {movie.genre}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Section: Phim sắp chiếu */}
      <div className="w-full max-w-5xl mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Phim sắp chiếu</h2>
          <Button
            variant="link"
            onClick={() => navigate("/movies?status=coming_soon")}
          >
            All
          </Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            Đang tải...
          </div>
        ) : comingSoon.length === 0 ? (
          <div className="text-muted-foreground text-center">
            Không có phim sắp chiếu.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {comingSoon.slice(0, 4).map((movie) => (
              <Link to={`/movies/${movie.id}`} key={movie.id}>
                <Card className="overflow-hidden hover:shadow-lg transition relative py-0">
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Sắp chiếu
                    </Badge>
                  </div>
                  <CardContent className="p-0">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <div className="font-semibold truncate mb-1">
                        {movie.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {movie.genre}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
