import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Heart, Play, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import ShowtimeLayout from "@/components/showtime-layout";
import { fetchShowtimesByMovieThunk } from "@/store/slices/showtimeSlice";
import { fetchMovieByIdThunk } from "@/store/slices/movieSlice";
import {
  createBookmarkThunk,
  removeBookmarkThunk,
} from "@/store/slices/bookmarkSlice";
import {
  removeBookmarkforCurrentUser,
  setBookmarkforCurrentUser,
} from "@/store/slices/authSlice";
import CommentSection from "@/components/CommentSection";
import { toast } from "sonner";
import { getAverageRatingThunk } from "@/store/slices/commentSlice";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { movieDetail, loading } = useAppSelector((state) => state.movie);
  const { showtimes, loading: showtimesLoading } = useAppSelector(
    (state) => state.showtime
  );
  const { user } = useAppSelector((state) => state.auth);

  const { bookmarks, loading: bookmarkLoading } = useAppSelector(
    (state) => state.bookmark
  );
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    if (movieDetail) {
      const bookmarked = movieDetail.bookmarks?.some(
        (bookmark) => bookmark.userId === user?.id
      );
      setIsBookmarked(!!bookmarked);
    } else {
      setIsBookmarked(false);
    }
  }, [movieDetail, user?.id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieByIdThunk(id));
      dispatch(fetchShowtimesByMovieThunk({ movieId: id, params: {} }));
      dispatch(getAverageRatingThunk(id)).then((action: any) => {
        if (action.payload && typeof action.payload.averageRating === "number") {
          setAverageRating(action.payload.averageRating);
        }
      });
    }
  }, [dispatch, id]);

  const handleToggleBookmark = () => {
    if (!movieDetail || !user) return;

    if (isBookmarked) {
      dispatch(removeBookmarkThunk(movieDetail.id))
        .unwrap()
        .then(() => {
          dispatch(removeBookmarkforCurrentUser(movieDetail.id));
          toast.success("Đã xóa khỏi danh sách yêu thích");
          if (id) {
            dispatch(fetchMovieByIdThunk(id));
          }
        })
        .catch((error: any) => {
          toast.error(error.message || "Có lỗi xảy ra");
        });
    } else {
      dispatch(createBookmarkThunk({ movieId: movieDetail.id }))
        .unwrap()
        .then((result) => {
          dispatch(setBookmarkforCurrentUser(result));
          toast.success("Đã thêm vào danh sách yêu thích");
          if (id) {
            dispatch(fetchMovieByIdThunk(id));
          }
        })
        .catch((error: any) => {
          toast.error(error.message || "Có lỗi xảy ra");
        });
    }
  };

  const handleWatchTrailer = () => {
    if (!movieDetail?.trailer_url) {
      toast.error("Không có trailer cho phim này");
      return;
    }

    window.open(movieDetail.trailer_url, "_blank");
  };

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
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold">{movieDetail.title}</h1>
            {/* Status Badge */}
            {movieDetail.status === "coming_soon" && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                Sắp chiếu
              </Badge>
            )}
            {movieDetail.status === "now_showing" && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                Đang chiếu
              </Badge>
            )}
            {movieDetail.status === "ended" && (
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
              >
                Đã kết thúc
              </Badge>
            )}
            <div className="flex items-center gap-1 ml-2">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {typeof averageRating === "number" && !isNaN(averageRating)
                  ? averageRating.toFixed(1)
                  : "0"}
                /5
              </span>
            </div>
          </div>
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
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="lg"
                onClick={handleToggleBookmark}
                disabled={bookmarkLoading}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    isBookmarked ? "fill-current" : ""
                  }`}
                />
                {isBookmarked ? "Đã yêu thích" : "Thêm yêu thích"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleWatchTrailer}
                disabled={!movieDetail?.trailer_url}
              >
                <Play className="h-4 w-4 mr-2" />
                {movieDetail?.trailer_url ? "Xem Trailer" : "Không có Trailer"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes Section */}
      {showtimesLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 dark:border-green-400"></div>
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              Đang tải lịch chiếu...
            </span>
          </div>
        </div>
      ) : (
        <div>
          <ShowtimeLayout showtimes={showtimes?.data || []} />
        </div>
      )}

      {movieDetail?.id && (
        <div className="mt-12">
          <CommentSection movieId={movieDetail.id} currentUserId={user?.id} />
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
