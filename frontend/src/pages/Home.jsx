import {React, useEffect} from "react";
import MovieList from "../components/Home/MovieList";
import { useMovies } from "../context/MovieContext";
import SearchBar from "../components/Home/SearchBar";
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
    recommendations,
    loading,
    loadingRecommendations,
  } = useMovies(); // Using context for movie data
  const userToken = localStorage.getItem("userToken");
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    console.log("🏆 Homepage Recommendations:", recommendations);
}, [recommendations]);

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
          <h2 className="text-2xl sm:text-3xl font-extrabold bg-clip-text mb-4 font-[Poppins]">
                On Trend 🔥
            </h2>,
          <TrendingCarousel movies={mixedMoviesDate} />
        )}
      </div>

      {/* Recommended Movies Carousel */}
      <div className="w-full mt-8">
        <h2 className="text-2xl font-bold mb-4">🎬 Recommended Movies</h2>
        {loadingRecommendations ? (
          <p className="text-yellow-500 animate-pulse">⏳ Loading recommendations... Please wait.</p>
        ) : recommendations.length > 0 ? (
          <TrendingCarousel movies={recommendations} />
        ) : (
          <p className="text-gray-400">No recommendations available.</p>
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
