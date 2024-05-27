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
    <div className="border-red-500 border-2 flex flex-col text-center w-full">
      <span className="bg-slate-500 py-2">Part_Time</span>
      <div className="border-b-2 py-2">reserve</div>
      <ul className="mt-2">
        {cinemas.map((cinema) => (
          <li
            key={cinema.show_id}
            className={`py-2 font-semibold capitalize cursor-pointer ${
              timeToggle && showId === cinema.show_id ? "bg-red-500" : ""
            }`}
            onClick={() => setShowInfo(cinema)}
          >
            {`Start Time(part_time${cinema.part_time}) : `}
            {cinema.part_time === 1
              ? "08:00~"
              : cinema.part_time === 2
              ? "13:00~"
              : cinema.part_time === 3
              ? "18:00~"
              : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TimeList;
