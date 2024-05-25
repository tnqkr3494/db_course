import axios from "axios";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

interface IUser {
  userId: string;
  username: string;
}

interface IFavoriteMovie {
  favorite_movie: string;
  movie_id: string;
}

interface ITickets {
  user_name: string;
  price: number;
  part_time: number;
  cinema_name: string;
  cinema_id: string;
}

const Profile = () => {
  const [user, setUser] = useState<IUser | undefined>();
  const [favoriteMovies, setFavoriteMovies] = useState<IFavoriteMovie[]>([]);
  const [tickets, setTickets] = useState<ITickets[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true, // 쿠키를 전송하기 위해 설정
        });
        setUser(userResponse.data.user);

        if (userResponse.data.user) {
          const favoritesResponse = await axios.get(
            "http://localhost:8080/api/user/favorite",
            {
              withCredentials: true, // 쿠키를 전송하기 위해 설정
            }
          );
          setFavoriteMovies(favoritesResponse.data);

          const ticketsResponse = await axios.get(
            "http://localhost:8080/api/user/tickets",
            {
              withCredentials: true, // 쿠키를 전송하기 위해 설정
            }
          );
          setTickets(ticketsResponse.data);
        }
      } catch (error) {
        console.error(
          "사용자 정보나 좋아하는 영화 목록을 가져오는 중 오류 발생:",
          error
        );
        setUser(undefined);
        setFavoriteMovies([]);
        setTickets([]);
      }
    };

    fetchUser();
  }, []);

  const handleClicked = async (id: string) => {
    if (!user) return;
    const { userId } = user;
    const response = await axios.post(
      `http://localhost:8080/api/dislike/${id}`,
      {
        userId,
        id,
      },
      { withCredentials: true } // 쿠키를 전송하기 위해 설정
    );
    if (response.status === 200) {
      setFavoriteMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.movie_id !== id)
      );
    }
  };

  const groupedTickets = tickets.reduce((acc, ticket) => {
    const key = `${ticket.cinema_id}-${ticket.part_time}`;
    if (!acc[key]) {
      acc[key] = { ...ticket, count: 1 };
    } else {
      acc[key].count += 1;
    }
    return acc;
  }, {} as { [key: string]: ITickets & { count: number } });

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex flex-col items-center justify-center py-10">
      {user ? (
        <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-3xl text-center transform transition duration-500 hover:scale-105">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Welcome, {user.username}!
          </h1>
          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-700">
            Your Favorite Movie List
          </h2>
          <ul className="gap-4 flex flex-col">
            {favoriteMovies.map((movie) => (
              <li
                key={movie.movie_id}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md transform transition duration-300 hover:scale-105"
              >
                <Link to={`/movie/${movie.movie_id}`}>
                  <div className="flex items-center gap-4">
                    <img
                      src={`/${movie.movie_id}.jpeg`}
                      alt={movie.favorite_movie}
                      className="w-16 h-24 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <span className="text-lg text-gray-800">
                      {movie.favorite_movie}
                    </span>
                  </div>
                </Link>
                <FaHeart
                  className="text-2xl cursor-pointer text-red-500"
                  onClick={() => handleClicked(movie.movie_id)}
                />
              </li>
            ))}
          </ul>
          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-700">
            Your Tickets List
          </h2>
          <ul className="gap-4 flex flex-col">
            {Object.values(groupedTickets).map((ticket) => (
              <li
                key={`${ticket.cinema_id}-${ticket.part_time}`}
                className="bg-white p-6 rounded-lg shadow-lg relative before:content-[''] before:absolute before:top-0 before:left-0 before:h-full before:w-8 before:bg-gradient-to-t from-gray-200 to-gray-100 before:rounded-l-lg after:content-[''] after:absolute after:top-0 after:right-0 after:h-full after:w-8 after:bg-gradient-to-t after:rounded-r-lg"
              >
                <div className="flex flex-col items-start space-y-2 px-5">
                  <span className="text-lg font-semibold text-gray-800">
                    Cinema: {ticket.cinema_name}
                  </span>
                  <span className="text-lg text-gray-600">
                    Part Time: {ticket.part_time}
                  </span>
                  <span className="text-lg text-gray-800">
                    Price: {ticket.price} ₩
                  </span>
                  <span className="text-lg text-gray-800">
                    Quantity: {ticket.count}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          {/* 다른 컴포넌트나 페이지에서 user 상태를 사용 */}
        </div>
      ) : (
        <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md text-center transform transition duration-500 hover:scale-105">
          <Link to={`/login`}>
            <h1 className="text-3xl font-bold text-gray-800">Please Login</h1>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
