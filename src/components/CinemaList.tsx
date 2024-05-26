import { ICinemas } from "../pages/Ticket";
import { IMovies } from "./Slider";

interface ICinemaList {
  cinemas: ICinemas[];
}

function CinemaList({ cinemas }: ICinemaList) {
  return (
    <div className="border-red-500 border-2 flex flex-col text-center w-full">
      <span className="bg-slate-500 py-2">Cinemas</span>
      <div className="border-b-2 py-2">reserve</div>
      <ul className="mt-2">
        {cinemas.map((cinema, index) => (
          <li key={index} className="py-2 font-semibold capitalize">
            {cinema.cinema_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CinemaList;
