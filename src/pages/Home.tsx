import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "../components/Slider";
import { Link } from "react-router-dom";

interface Users {
  id: string;
  movie_name: string;
}

const Home = () => {
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
            <Link to="/profile">
              <button className="btn btn-primary">Get Started</button>
            </Link>
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
        <p>This is a list of movies that are playing in our movie theater.</p>
      </div>
      <Slider isGenre={true} />
    </div>
  );
};

export default Home;
