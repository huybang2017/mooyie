import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Star, Calendar, MapPin, Trash2 } from "lucide-react";

// Fake bookmark data
const fakeBookmarks = [
  {
    id: "1",
    movieId: "1",
    title: "Avengers: Endgame",
    image: "https://images.unsplash.com/photo-1531259683001-31fb7555156c?w=400&h=600&fit=crop",
    genre: "Action, Adventure, Drama",
    duration: 181,
    rating: 8.4,
    releaseDate: "2019-04-26",
    theater: "CGV Aeon Mall",
    showtime: "2024-01-15T19:30:00",
    addedAt: "2024-01-10T10:30:00",
  },
  {
    id: "2",
    movieId: "2",
    title: "Spider-Man: No Way Home",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop",
    genre: "Action, Adventure, Fantasy",
    duration: 148,
    rating: 8.2,
    releaseDate: "2021-12-17",
    theater: "Lotte Cinema",
    showtime: "2024-01-16T20:00:00",
    addedAt: "2024-01-09T15:45:00",
  },
  {
    id: "3",
    movieId: "3",
    title: "The Batman",
    image: "https://images.unsplash.com/photo-1531259683001-31fb7555156c?w=400&h=600&fit=crop",
    genre: "Action, Crime, Drama",
    duration: 176,
    rating: 7.8,
    releaseDate: "2022-03-04",
    theater: "BHD Star",
    showtime: "2024-01-17T18:30:00",
    addedAt: "2024-01-08T09:15:00",
  },
  {
    id: "4",
    movieId: "4",
    title: "Black Panther: Wakanda Forever",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop",
    genre: "Action, Adventure, Drama",
    duration: 161,
    rating: 7.3,
    releaseDate: "2022-11-11",
    theater: "Galaxy Cinema",
    showtime: "2024-01-18T19:00:00",
    addedAt: "2024-01-07T14:20:00",
  },
  {
    id: "5",
    movieId: "5",
    title: "Doctor Strange in the Multiverse of Madness",
    image: "https://images.unsplash.com/photo-1531259683001-31fb7555156c?w=400&h=600&fit=crop",
    genre: "Action, Adventure, Fantasy",
    duration: 126,
    rating: 7.0,
    releaseDate: "2022-05-06",
    theater: "CGV Aeon Mall",
    showtime: "2024-01-19T20:30:00",
    addedAt: "2024-01-06T11:30:00",
  },
  {
    id: "6",
    movieId: "6",
    title: "Thor: Love and Thunder",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop",
    genre: "Action, Adventure, Comedy",
    duration: 119,
    rating: 6.7,
    releaseDate: "2022-07-08",
    theater: "Lotte Cinema",
    showtime: "2024-01-20T17:00:00",
    addedAt: "2024-01-05T16:45:00",
  },
];

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState(fakeBookmarks);
  const [sortBy, setSortBy] = useState<"date" | "rating" | "title">("date");

  const handleRemoveBookmark = (bookmarkId: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
  };

  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case "rating":
        return b.rating - a.rating;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bookmarks</h1>
          <p className="text-muted-foreground">
            {bookmarks.length} phim đã được đánh dấu
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sắp xếp theo:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "rating" | "title")}
            className="px-3 py-1 border rounded-md text-sm bg-background"
          >
            <option value="date">Ngày thêm</option>
            <option value="rating">Đánh giá</option>
            <option value="title">Tên phim</option>
          </select>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chưa có bookmark nào</h3>
          <p className="text-muted-foreground mb-4">
            Bạn chưa đánh dấu phim nào. Hãy khám phá và đánh dấu những bộ phim yêu thích!
          </p>
          <Button asChild>
            <Link to="/movies">Khám phá phim</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={bookmark.image}
                    alt={bookmark.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      {bookmark.rating}
                    </Badge>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveBookmark(bookmark.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <CardTitle className="text-white text-lg">{bookmark.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{bookmark.duration} phút</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(bookmark.releaseDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{bookmark.theater}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs">
                      {formatDate(bookmark.showtime)} - {formatTime(bookmark.showtime)}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {bookmark.genre.split(", ").map((genre, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-muted-foreground">
                    Đã thêm {getTimeAgo(bookmark.addedAt)}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/movies/${bookmark.movieId}`}>
                        Chi tiết
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to={`/booking/${bookmark.movieId}`}>
                        Đặt vé
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks; 