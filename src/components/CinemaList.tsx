import { IMovies } from "./Slider";

interface ICinemaList {
  movies: IMovies[];
}

function CinemaList({ movies }: ICinemaList) {
  const handleClick = (id: string) => {};

  return (
    <div className="border-red-500 border-2 flex flex-col text-center w-full">
      <span className="bg-slate-500 py-2">영화</span>
      <div className="border-b-2 py-2">reserve</div>
      <ul className="mt-2">
        {movies.map((movie) => (
          <li
            key={movie.id}
            className="py-2 font-semibold capitalize"
            onClick={() => handleClick(movie.id)}
          >
            {movie.movie_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CinemaList;
