import { ICinemas } from "../pages/Ticket";
import { IMovies } from "./Slider";

interface ICinemaList {
  cinemas: ICinemas[];
}

function CinemaList({ cinemas }: ICinemaList) {
  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <h2 className="bg-gray-200 text-gray-800 text-lg font-semibold py-2 px-4 mb-4 rounded-lg shadow-md">
        Cinemas
      </h2>
      <div className="mb-4">
        <ul>
          {cinemas.map((cinema, index) => (
            <li key={index} className="py-2 font-semibold capitalize">
              {cinema.cinema_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CinemaList;
