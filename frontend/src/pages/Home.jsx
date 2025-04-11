import React from "react";
import MovieList from "../components/Home/MovieList";
import { useMovies } from "../context/MovieContext";
import SearchBar from "../components/Home/SearchBar"; // Replace SearchContainer with SearchBar
import TrendingCarousel from "../components/Home/Carousel";
import Sidebar from "../components/Home/Sidebar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const {
    mixedMoviesDate,
    bollywoodMoviesDate,
    hollywoodMoviesDate,
    horrorMovies,
    comedyMovies,
    actionMovies,
    loading,
  } = useMovies(); // Using the context to fetch movies
  const userToken = localStorage.getItem("userToken"); // Check token directly
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="home-container bg-black text-white min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Login Button */}
      {!userToken && (
        <div className="absolute top-4 right-4">
          <button
            onClick={handleLogin}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Login
          </button>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Search Bar */}
      <SearchBar />

      {/* Trending Movies Carousel */}
      <div className="w-full">
        {loading ? (
          <p>Loading Trending Movies...</p>
        ) : (
          <TrendingCarousel movies={mixedMoviesDate} />
        )}
      </div>

      {/* Movie Categories */}
      <div className="w-full mt-8 sm:mt-10 md:mt-12">
        {loading ? (
          <p>Loading Categories Movies...</p>
        ) : (
          <MovieList
            bollywoodMoviesDate={bollywoodMoviesDate}
            hollywoodMoviesDate={hollywoodMoviesDate}
            horrorMovies={horrorMovies}
            comedyMovies={comedyMovies}
            actionMovies={actionMovies}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
