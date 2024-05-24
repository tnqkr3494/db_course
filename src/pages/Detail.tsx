import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface IMovie {
  id: string;
  movie_name: string;
  year: number;
  rating: number;
  language: string;
  summary: string;
  actor_name: string;
  director_name: string;
}

const Detail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<IMovie[]>([]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/movie/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchMovie();
  }, [id]);

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
              <span className="font-semibold">Actors:</span>
              <ul className="list-disc list-inside pl-4">
                {movie.map((detail, index) => (
                  <li key={index}>{detail.actor_name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
