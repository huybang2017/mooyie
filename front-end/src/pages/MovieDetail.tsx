import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Calendar, Clock, Star, Users } from "lucide-react";

const fakeMovies = [
  {
    id: "1",
    title: "Inception",
    description: "A mind-bending thriller by Christopher Nolan.",
    genre: "Sci-Fi",
    duration: 148,
    releaseDate: "2010-07-16",
    rating: 8.8,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
  },
  {
    id: "2",
    title: "The Matrix",
    description: "A hacker discovers the shocking truth about his reality.",
    genre: "Action",
    duration: 136,
    releaseDate: "1999-03-31",
    rating: 8.7,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/aZiK13I8vIcb6xaUufIjQIGfAzx.jpg",
  },
  {
    id: "3",
    title: "Interstellar",
    description: "A team travels through a wormhole in space.",
    genre: "Adventure",
    duration: 169,
    releaseDate: "2014-11-07",
    rating: 8.6,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
  },
];

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movie = fakeMovies.find((m) => m.id === id);

  if (!movie) {
    return <div className="text-center text-red-500">Movie not found</div>;
  }

  const handleBookTickets = () => {
    navigate(`/booking/select/${movie.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <p className="text-muted-foreground mb-6">{movie.description}</p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Release Date:</strong>{" "}
                {new Date(movie.releaseDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Duration:</strong> {movie.duration} minutes
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Genre:</strong> {movie.genre}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm">
                <strong>Rating:</strong> {movie.rating}/10
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full md:w-auto"
              onClick={handleBookTickets}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Tickets
            </Button>

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
    </div>
  );
};

export default MovieDetail;
