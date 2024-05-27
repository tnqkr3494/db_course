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
    <div className="border border-gray-300 rounded-lg p-4">
      <h2 className="bg-gray-200 text-gray-800 text-lg font-semibold py-2 px-4 mb-4 rounded-lg shadow-md">
        Movies
      </h2>
      <div className="mb-4">
        <ul>
          {movies.map((movie) => (
            <li
              key={movie.id}
              className={`flex items-center justify-between p-2 cursor-pointer rounded-lg 
                ${
                  movieToggle && movieTitle === movie.movie_name
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }
              `}
              onClick={() => handleClick(movie.id)}
            >
              <span className="font-semibold">{movie.movie_name}</span>
              {movieToggle && movieTitle === movie.movie_name && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 00-.707.293l-8 8a1 1 0 000 1.414l8 8a1 1 0 001.414-1.414L4.414 11H18a1 1 0 100-2H4.414l6.293-6.293A1 1 0 0010 2z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MovieList;
