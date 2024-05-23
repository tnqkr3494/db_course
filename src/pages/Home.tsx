import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "../components/Slider";

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
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
            <p className="mb-5">
              Our Cinema is offering old masterpieces!
              <br /> Come and see them
            </p>
            <a href="/profile">
              <button className="btn btn-primary">Get Started</button>
            </a>
          </div>
        </div>
      </section>
      <div className="mt-80 mb-28 text-center flex flex-col gap-5">
        <h2 className="font-semibold text-5xl">Movies</h2>
        <p>This is a list of movies that are playing in our movie theater.</p>
      </div>
      <Slider />
    </div>
  );
};

export default Home;
