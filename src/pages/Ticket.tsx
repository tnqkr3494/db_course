import React, { useEffect, useState } from "react";
import { IMovies } from "../components/Slider";
import axios from "axios";
import MovieList from "../components/MovieList";

const Ticket = () => {
  const [movies, setMovies] = useState<IMovies[]>([]);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/movie",

          {
            withCredentials: true,
          }
        );
        console.log("hello");

        if (response.status === 200) {
          setMovies(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-4 gap-4"></div>
      <div className="mt-4 p-4 bg-gray-200 rounded">
        <h2 className="text-xl font-bold">Tickets</h2>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <MovieList movies={movies} />
      </div>
    </div>
  );
};

export default Ticket;
