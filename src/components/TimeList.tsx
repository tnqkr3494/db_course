import { ICinemas } from "../pages/Ticket";
import { IMovies } from "./Slider";

interface ITimeList {
  cinemas: ICinemas[];
  setShowInfo: ({}: ICinemas) => void;
  timeToggle: boolean;
  showId: number;
}

function TimeList({ cinemas, setShowInfo, timeToggle, showId }: ITimeList) {
  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <h2 className="bg-gray-200 text-gray-800 text-lg font-semibold py-2 px-4 mb-4 rounded-lg shadow-md">
        Part Time
      </h2>
      <div className="mb-4">
        <ul>
          {cinemas.map((cinema) => (
            <li
              key={cinema.show_id}
              className={`flex items-center justify-between p-2 cursor-pointer rounded-lg 
                ${
                  timeToggle && showId === cinema.show_id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }
              `}
              onClick={() => setShowInfo(cinema)}
            >
              <span className="font-semibold">{`Start Time (part_time${cinema.part_time}): `}</span>
              {cinema.part_time === 1
                ? "08:00 ~"
                : cinema.part_time === 2
                ? "13:00 ~"
                : cinema.part_time === 3
                ? "18:00 ~"
                : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TimeList;
