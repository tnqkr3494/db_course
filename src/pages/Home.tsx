import React from "react";
import axios from "axios";
import Slider from "../components/Slider";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";

interface ISearchMovie {
  title: string;
}

const Home = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ISearchMovie>();
  const navigate = useNavigate();

  const onSubmit = async (d: ISearchMovie) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/title/${d.title}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate(`/movie/${response.data}`);
      }
    } catch (e) {
      setError("title", {
        type: "server",
        message: "We don't have this movie information",
      });
    }
  };

  return (
    <div>
      <section className="hero min-h-screen bg-[url('./assets/images/main.png')]">
        <div className="hero-overlay bg-opacity-80 rounded-t-md"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-lg">
            <h1 className="mb-5 text-6xl font-bold">Nostalgia</h1>
            <p className="mb-5">
              Nostalgia Films proudly operates three cinemas dedicated to
              showcasing classic masterpieces. Our theaters bring timeless films
              back to the big screen, offering a unique cinematic experience.
              Join us to relive the golden age of cinema with carefully curated
              selections from the past.
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex items-center justify-center gap-2"
            >
              <input
                type="text"
                placeholder="search the movie..."
                className="px-5  py-4  text-2xl bg-black border-none rounded-md"
                {...register("title", { required: true })}
              />
              <button className="text-2xl">
                <FaSearch />
              </button>
            </form>
            {errors.title && (
              <div className="text-red-500 mt-2 text-center font-semibold">
                {errors.title.message}
              </div>
            )}
          </div>
        </div>
      </section>
      <div className="mt-80 mb-28 text-center flex flex-col gap-5">
        <h2 className="font-semibold text-5xl">Movies</h2>
        <p>This is a list of movies that are playing in our movie theater.</p>
      </div>
      <Slider />
      <div className="mt-50 mb-28 text-center flex flex-col gap-5">
        <h2 className="font-semibold text-5xl">Genres</h2>
        <p>You can also view movies sorted by genre.</p>
      </div>
      <Slider isGenre={true} />
    </div>
  );
};

export default Home;
