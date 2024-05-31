import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // 좋아요 아이콘 추가

interface IMovie {
  id: string;
  movie_name: string;
  year: number;
  rating: number;
  language: string;
  summary: string;
  actor_name: string;
  director_name: string;
  director_gender: string;
  director_age: number;
  actor_gender: string;
  actor_age: number;
  age: number;
}

interface IUser {
  userId: string;
  username: string;
}

const Detail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<IMovie[]>([]);
  const [user, setUser] = useState<IUser | null>(null); // 사용자 상태 추가
  const [liked, setLiked] = useState<boolean>(false); // 좋아요 상태 추가

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/movie/${id}`,
          {
            withCredentials: true,
          }
        );
        setMovie(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    const fetchFav = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/user/favorite",
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          if (response.data.some((data: any) => data.movie_id === id)) {
            setLiked(true);
          }
        }
      } catch (error) {
        console.log("Error", error);
      }
    };

    fetchMovie();
    fetchUser();
    fetchFav();
  }, [id]);

  const handleLike = async () => {
    if (!user) return;
    const { userId } = user;

    if (!liked) {
      try {
        await axios.post(
          `http://localhost:8080/api/like/${id}`,
          { userId, id },
          {
            withCredentials: true,
          }
        );
        setLiked(!liked); // 좋아요 상태 토글
      } catch (error) {
        console.error("Error liking movie:", error);
      }
    } else {
      try {
        await axios.post(
          `http://localhost:8080/api/dislike/${id}`,
          { userId, id },
          {
            withCredentials: true,
          }
        );
        setLiked(!liked); // 좋아요 상태 토글
      } catch (error) {
        console.error("Error liking movie:", error);
      }
    }
  };

  if (!movie.length) {
    return <div>Loading...</div>;
  }

  const img = `/${id}.jpeg`;
  const bgimg = `/${id}_bg.jpeg`;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-center bg-cover p-4"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-4xl w-full md:flex hover:scale-110 transition-transform">
        <div className="md:flex-shrink-0">
          <img
            src={img}
            alt={`${movie[0].movie_name} poster`}
            className="w-full h-full object-cover md:w-96"
          />
        </div>
        <div className="p-8 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            {movie[0].movie_name}
          </h1>
          <div className="text-gray-700 text-base mb-4">
            <p className="mb-2">
              <span className="font-semibold">Rating:</span>{" "}
              <span className="text-yellow-400">★</span> {movie[0].rating}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Year:</span> {movie[0].year}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Language:</span>{" "}
              {movie[0].language}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Summary:</span>{" "}
              <span className="italic">{movie[0].summary}</span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Director:</span>{" "}
              {movie[0].director_name}
            </p>
            <div className="mb-2">
              <span className="font-semibold">Actors</span>
              <ul className="list-disc list-inside pl-4">
                {movie.map((detail, index) => (
                  <li key={index} className="">
                    {detail.actor_name}{" "}
                    <span
                      className={
                        detail.actor_gender === "Male"
                          ? "text-blue-500"
                          : "text-red-500"
                      }
                    >
                      {detail.actor_gender === "Male" ? "♂︎" : "♀︎"}
                    </span>
                    , age : {detail.actor_age}
                  </li>
                ))}
              </ul>
            </div>
            {user && (
              <button
                onClick={handleLike}
                className="mt-4 flex items-center space-x-2 text-pink-600 hover:text-pink-800 focus:outline-none"
              >
                {liked ? (
                  <FaHeart className="text-2xl" />
                ) : (
                  <FaRegHeart className="text-2xl" />
                )}
                <span className="text-lg">{liked ? "Liked" : "Like"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
