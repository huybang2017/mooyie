import { Link } from "react-router-dom";

const fakeMovies = [
  {
    id: "1",
    title: "Inception",
    genre: "Sci-Fi",
    duration: 148,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
  },
  {
    id: "2",
    title: "The Matrix",
    genre: "Action",
    duration: 136,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/aZiK13I8vIcb6xaUufIjQIGfAzx.jpg",
  },
  {
    id: "3",
    title: "Interstellar",
    genre: "Adventure",
    duration: 169,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
  },
  {
    id: "4",
    title: "Avatar",
    genre: "Fantasy",
    duration: 162,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg",
  },
];

const Movies = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Movies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fakeMovies.map((movie) => (
          <Link to={`/movies/${movie.id}`} key={movie.id}>
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{movie.title}</h3>
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
    </div>
  );
};

export default Movies;
