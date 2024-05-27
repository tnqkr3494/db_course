import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

interface ICinema {
  cinema_id: string;
  cinema_name: string;
  location: string;
  movie_name: string;
  movie_id: string;
  year: number;
  rating: number;
  language: string;
  summary: string;
  price: number;
  part_time: number;
}

const Cinema = () => {
  const { id } = useParams<{ id: string }>();
  const [cinema, setCinema] = useState<ICinema[] | null>(null);

  useEffect(() => {
    const fetchCinema = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/cinema/${id}`,
          {
            withCredentials: true,
          }
        );
        setCinema(response.data);
      } catch (error) {
        console.error("Error fetching cinema:", error);
      }
    };

    fetchCinema();
  }, [id]);

  if (!cinema) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex items-center justify-center">
      <div className="w-[65rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 capitalize">
            {cinema[0].cinema_name}
          </h1>
          <p className="text-gray-600 mb-6">Location : {cinema[0].location}</p>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Movies currently showing
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-5">
            {cinema.map((movie) => (
              <Link to={`/movie/${movie.movie_id}`} key={movie.movie_id}>
                <div
                  className="shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
                  style={{ height: "350px", width: "100%" }}
                >
                  <div
                    className="bg-cover bg-center h-full"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/${movie.movie_id}.jpeg)`,
                      objectFit: "cover",
                    }}
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {movie.movie_name}
                      </h3>
                      <hr />
                      <p className="text-white mt-4 mb-2">
                        Rating: <span className="text-yellow-400">★</span>{" "}
                        {movie.rating}
                      </p>
                      <p className="text-white mb-2">Year: {movie.year}</p>
                      <p className="text-white mb-2">
                        Language: {movie.language}
                      </p>
                      <hr />
                      <p className="text-white my-4">
                        Ticket Price : {movie.price}
                      </p>
                      <p className="text-white mb-4">
                        Part Time : {movie.part_time}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/tickets">
            <span className="capitalize text-red-500 font-extrabold hover:text-red-400">
              ➡ go to see the movies
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cinema;
