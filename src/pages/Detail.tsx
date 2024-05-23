import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface IMovie {
  movie_name: string;
  year: number;
  rating: number;
  language: string;
  summary: string;
}

const Detail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<IMovie>();

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
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const img = `/${movie.movie_name}.jpeg`;
  const bgimg = `/${movie.movie_name}_bg.jpeg`;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-md w-full">
        <div
          className="bg-cover bg-center h-64 object-cover object-center"
          style={{ backgroundImage: `url(${img})` }}
        ></div>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{movie.movie_name}</h1>
          <p className="text-gray-700 text-base mb-4">
            <span className="font-semibold">Rating:</span>{" "}
            <span className="text-yellow-400">★</span> {movie.rating}
          </p>
          <p className="text-gray-700 text-base mb-4">
            <span className="font-semibold">Year:</span> {movie.year}
          </p>
          <p className="text-gray-700 text-base mb-4">
            <span className="font-semibold">Language:</span> {movie.language}
          </p>
          <p className="text-gray-700 text-base mb-4 italic">
            <span className="font-semibold">Summary:</span> {movie.summary}
          </p>
          {/* 영화의 다른 정보를 추가로 표시 */}
        </div>
      </div>
    </div>
  );
};

export default Detail;
