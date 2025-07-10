import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Calendar, Clock, Star, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import ShowtimeLayout from "@/components/showtime-layout";
import { fetchShowtimesByMovieThunk } from "@/store/slices/showtimeSlice";
import { fetchMovieByIdThunk } from "@/store/slices/movieSlice";
import CommentSection from "@/components/CommentSection";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { movieDetail, loading } = useAppSelector((state) => state.movie);
  const { showtimes } = useAppSelector((state) => state.showtime);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieByIdThunk(id));
      dispatch(fetchShowtimesByMovieThunk(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <p className="text-center text-gray-500">Đang tải phim...</p>;
  }

  if (!movieDetail) {
    return <div className="text-center text-red-500">Không tìm thấy phim</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={movieDetail.image}
            alt={movieDetail.title}
            className="w-full rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{movieDetail.title}</h1>
          <p className="text-muted-foreground mb-6">
            {movieDetail.description}
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Release Date:</strong>{" "}
                {new Date(movieDetail.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Duration:</strong> {movieDetail.duration} minutes
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Genre:</strong> {movieDetail.genre}
              </span>
            </div>
            {/* <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm">
                <strong>Rating:</strong> {movieDetail.rating}/10
              </span>
            </div> */}
          </div>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <Button variant="outline" size="lg">
                <Star className="h-4 w-4 mr-2" />
                Add to Favorites
              </Button>
              <Button variant="outline" size="lg">
                Watch Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ShowtimeLayout showtimes={showtimes} />
      </div>

      {movieDetail?.id && (
        <div className="mt-12">
          <CommentSection movieId={movieDetail.id} currentUserId={user?.id} />
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
