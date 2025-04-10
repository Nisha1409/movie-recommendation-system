import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import MovieCard from "../components/Home/MovieCard";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, searchQuery } = useMovies();

  const localResults = location.state?.results || searchResults;
  const localQuery = location.state?.query || searchQuery;

  // 🧠 Remove duplicate movies based on unique 'id' or 'title'
  const uniqueResults = Array.from(
    new Map(localResults.map(movie => [movie.id || movie.title, movie])).values()
  );

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="mb-4">
        <button
          onClick={() => navigate("/")}
          className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition"
        >
          ← Back
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        {localQuery ? `Results for "${localQuery}"` : "Search Results"}
      </h2>

      {uniqueResults.length > 0 ? (
        <MovieCard movies={uniqueResults} />
      ) : (
        <p className="text-gray-400 text-lg">No results found. Try searching something else.</p>
      )}
    </div>
  );
};

export default SearchResults;
