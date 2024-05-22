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
      <section
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
      >
        <div className="hero-overlay bg-opacity-80"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
            <p className="mb-5">
              Our Cinema is offering old masterpieces!
              <br /> Come and see them
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </section>
      <h2 className="mt-80 mb-40 text-center font-semibold text-5xl">
        Now Playing
      </h2>
      <Slider />
    </div>
  );
};

export default Home;
