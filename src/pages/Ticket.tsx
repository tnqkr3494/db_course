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
  cinema_id: string;
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
  const [ticketCount, setTicketCount] = useState(1);
  const [price, setPrice] = useState("");
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
          withCredentials: true,
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
      setMovieTitle("");
    }
  };

  const setShowInfo = ({
    show_id,
    cinema_name,
    part_time,
    price,
    cinema_id,
  }: ICinemas) => {
    if (!timeToggle) {
      setInfo({ show_id, cinema_name, part_time, price, cinema_id });
      setTimeToggle((prev) => !prev);
    } else {
      setInfo(undefined);
      setTimeToggle((prev) => !prev);
    }
  };

  const handleBuyTicket = () => {
    if (
      user &&
      movieTitle &&
      info &&
      Number(price) === info.price * ticketCount
    ) {
      setIsModalOpen(true);
    }
    if (user && info) {
      if (Number(price) > info.price * ticketCount) {
        alert("You have entered more money than the ticket price");
      } else if (Number(price) < info.price * ticketCount) {
        alert("You don't have enough money");
      }
    } else if (!user) {
      alert("Please login");
    }
  };

  const handleModalConfirm = async () => {
    if (user && info) {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/buy/tickets/${info.show_id}`,
          {
            userId: user.userId,
            ticketCount,
          },
          {
            withCredentials: true,
          }
        );
        navigate(`/buy/${info.show_id}`, {
          state: { message: response.data.message },
        });
      } catch (error: any) {
        if (error.response) {
          navigate(`/buy/${info.show_id}`, {
            state: { message: error.response.data.message },
          });
        } else {
          navigate(`/buy/${info.show_id}`, {
            state: { message: "An error occurred" },
          });
        }
      }
      setIsModalOpen(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Tickets</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
      <div className="flex flex-col justify-end mt-6 items-center gap-6">
        <div className="flex gap-6 bg-gray-800 text-white p-4 rounded-lg shadow-md items-center">
          <span>
            <span className="font-semibold text-red-500">Movie</span> :{" "}
            {movieTitle}
          </span>
          <span>
            <span className="font-semibold text-red-500">Cinema</span> :{" "}
            {info?.cinema_name}
          </span>
          <span>
            <span className="font-semibold text-red-500">Part_Time</span> :{" "}
            {info?.part_time}
          </span>
          <span>
            <span className="font-semibold text-red-500">Price</span> :{" "}
            {info?.price}
          </span>
          <select
            name="ticket"
            className="px-5 py-3 rounded-md bg-gray-800 text-white"
            value={ticketCount}
            onChange={(e) => setTicketCount(Number(e.target.value))}
          >
            {[...Array(5)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-5 items-center justify-center">
          <input
            type="text"
            required
            className="bg-gray-800 text-white px-5 py-3 rounded-md"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />
          <button
            onClick={handleBuyTicket}
            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md transition duration-300"
          >
            Buy Ticket
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Confirm Purchase</h3>
            <p className="mb-4">Do you want to buy the ticket?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleModalConfirm}
                className="btn bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
              >
                Yes
              </button>
              <button
                onClick={handleModalCancel}
                className="btn bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
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
