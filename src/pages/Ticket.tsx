import React, { useEffect, useState } from "react";
import { IMovies } from "../components/Slider";
import axios from "axios";
import MovieList from "../components/MovieList";
import CinemaList from "../components/CinemaList";

export interface ICinemas {
  cinema_name: string;
  part_time: number;
  price: number;
}

const Ticket = () => {
  const [movies, setMovies] = useState<IMovies[]>([]);
  const [cinemas, setCinemas] = useState<ICinemas[]>([]);

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

  const handleClick = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/search/${id}`,
        {
          withCredentials: true,
        }
      );
      setCinemas(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-4 gap-4"></div>
      <div className="mt-4 p-4 bg-gray-200 rounded">
        <h2 className="text-xl font-bold">Tickets</h2>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        <MovieList movies={movies} handleClick={handleClick} />
        <CinemaList cinemas={cinemas} />
      </div>
    </div>
  );
};

export default Ticket;
