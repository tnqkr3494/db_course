import { IMovies } from "./Slider";

interface IMovieList {
  movies: IMovies[];
  handleClick: (id: string) => void;
  movieToggle: boolean;
  movieTitle: string;
}

function MovieList({
  movies,
  handleClick,
  movieToggle,
  movieTitle,
}: IMovieList) {
  return (
    <div className="border-red-500 border-2 flex flex-col text-center w-full">
      <span className="bg-slate-500 py-2">Movies</span>
      <div className="border-b-2 py-2">reserve</div>
      <ul className="mt-2">
        {movies.map((movie) => (
          <li
            key={movie.id}
            className={`p-2 font-semibold capitalize cursor-pointer ${
              movieToggle && movieTitle === movie.movie_name ? "bg-red-500" : ""
            }`}
            onClick={() => handleClick(movie.id)}
          >
            {movie.movie_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieList;
