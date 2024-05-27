import React, { useEffect, useState } from "react";
import { IMovies } from "../components/Slider";
import axios from "axios";
import MovieList from "../components/MovieList";
import CinemaList from "../components/CinemaList";
import TimeList from "../components/TimeList";
import { IUser } from "./Profile";
import { useNavigate } from "react-router-dom";

export interface ICinemas {
  cinema_name: string;
  part_time: number;
  price: number;
  show_id: number;
}

const Ticket = () => {
  const [movies, setMovies] = useState<IMovies[]>([]);
  const [cinemas, setCinemas] = useState<ICinemas[]>([]);
  const [info, setInfo] = useState<ICinemas>();
  const [movieTitle, setMovieTitle] = useState("");
  const [movieToggle, setMovieToggle] = useState(false);
  const [timeToggle, setTimeToggle] = useState(false);
  const [user, setUser] = useState<IUser | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/movie", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setMovies(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true, // 쿠키를 전송하기 위해 설정
        });
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMovies();
    fetchUser();
  }, []);

  const handleClick = async (id: string) => {
    if (!movieToggle) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/search/${id}`,
          { withCredentials: true }
        );
        setCinemas(response.data);
        const title = movies.find((movie) => movie.id === id)?.movie_name;
        setMovieTitle(title!);
        setInfo(undefined);
        setMovieToggle((prev) => !prev);
      } catch (error) {
        console.log(error);
      }
    } else {
      setMovieToggle((prev) => !prev);
    }
  };

  const setShowInfo = ({
    show_id,
    cinema_name,
    part_time,
    price,
  }: ICinemas) => {
    if (!timeToggle) {
      setInfo({ show_id, cinema_name, part_time, price });
      setTimeToggle((prev) => !prev);
    } else {
      setInfo(undefined);
      setTimeToggle((prev) => !prev);
    }
  };

  const handleBuyTicket = () => {
    if (user && movieTitle && info) {
      setIsModalOpen(true);
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    navigate(`/buy/${info?.show_id}`);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mt-4 p-4 bg-gray-200 rounded">
        <h2 className="text-xl font-bold">Tickets</h2>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        <MovieList
          movies={movies}
          handleClick={handleClick}
          movieToggle={movieToggle}
          movieTitle={movieTitle}
        />
        <CinemaList cinemas={cinemas} />
        <TimeList
          cinemas={cinemas}
          setShowInfo={setShowInfo}
          timeToggle={timeToggle}
          showId={info?.show_id!}
        />
      </div>
      <div className="flex justify-end mt-5 items-center gap-5">
        <div className="flex gap-5 bg-slate-500 p-4 rounded-md">
          <span>Movie: {movieTitle}</span>
          <span>Cinema: {info?.cinema_name}</span>
          <span>Part_Time: {info?.part_time}</span>
          <span>Price: {info?.price}</span>
        </div>
        <button
          onClick={handleBuyTicket}
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-slate-500"
        >
          Buy Ticket
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-5 rounded-md shadow-md">
            <h3 className="text-lg font-bold mb-4">Confirm Purchase</h3>
            <p>Do you want to buy the ticket?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleModalConfirm}
                className="btn bg-green-500 text-white border-none"
              >
                Yes
              </button>
              <button
                onClick={handleModalCancel}
                className="btn bg-red-500 text-white border-none"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ticket;
