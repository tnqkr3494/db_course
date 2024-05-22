import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -60,

    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const rowVariants = {
  hidden: (isBack: boolean) => {
    return { x: isBack ? -window.outerWidth - 5 : window.outerWidth + 5 };
  },
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => {
    return { x: isBack ? window.outerWidth + 5 : -window.outerWidth - 5 };
  },
};

const btnVariants = {
  hover: {
    opacity: 0.7,
  },
};

const offset = 6;

interface IMovies {
  id: string;
  movie_name: string;
  year: number;
  summary: string;
  rating: number;
  language: string;
}

function Slider() {
  const [movies, setMovies] = useState<IMovies[]>([]);
  const [isBack, setIsBack] = useState(false);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/movie");
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const nextSlide = () => {
    if (movies.length > 0) {
      if (leaving) return;
      console.log("next");

      toggleLeaving();
      const totalMovies = movies.length - 1;
      const maxIndex = Math.floor(totalMovies / offset);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setIsBack(false);
    }
  };

  const prevSlide = () => {
    if (movies.length > 0) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movies.length - 1;
      const maxIndex = Math.floor(totalMovies / offset);
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setIsBack(true);
    }
  };

  return (
    <motion.div className="relative h-[50vh]">
      <AnimatePresence
        initial={false}
        onExitComplete={toggleLeaving}
        custom={isBack}
      >
        <motion.div
          key={index}
          className="absolute grid gap-2 grid-cols-6 w-full px-1"
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          custom={isBack}
        >
          {movies
            .slice(index * offset, index * offset + offset)
            .map((movie) => (
              <motion.div
                key={movie.id}
                className="relative h-52 bg-[url('./assets/images/poster.jpeg')] text-red-500 text-6xl bg-cover bg-center flex justify-center items-center text-center rounded-md cursor-pointer hover:z-10"
                variants={boxVariants}
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween" }}
              >
                <div className="text-base font-medium text-white max-w-xs">
                  {movie.movie_name}
                </div>
                <motion.div
                  className="absolute bottom-0 w-full bg-black bg-opacity-50 p-2 flex flex-col items-center text-white text-sm font-medium opacity-0"
                  variants={infoVariants}
                >
                  <div className="text-lg text-red-500">★ {movie.rating}</div>
                  <div>개봉 연도: {movie.year}</div>
                  <div>언어: {movie.language}</div>
                </motion.div>
              </motion.div>
            ))}
        </motion.div>
      </AnimatePresence>
      <motion.div
        className="absolute top-32 bg-white bg-opacity-50 w-15 h-15 rounded-full flex justify-center items-center  cursor-pointer"
        variants={btnVariants}
        onClick={prevSlide}
      >
        ◀️
      </motion.div>
      <motion.div
        className="absolute top-32 bg-white bg-opacity-50 w-15 h-15 rounded-full flex justify-center items-center cursor-pointer right-0"
        variants={btnVariants}
        onClick={nextSlide}
      >
        ▶️
      </motion.div>
    </motion.div>
  );
}

export default Slider;
