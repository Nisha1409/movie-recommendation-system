import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import MovieCard from "../components/Home/MovieCard";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, searchQuery } = useMovies();

  console.log("Search Query from Context:", searchQuery); // Debugging log
  console.log("Search Results from Context:", searchResults); // Debugging log

  // Prefer route state (if freshly navigated) otherwise fallback to global context
  const results = location.state?.results || searchResults || [];
  const query = location.state?.query || searchQuery || "";

  console.log("Final Results:", results); // Debugging log
  console.log("Final Query:", query); // Debugging log

  // Remove duplicate movies by 'id' or 'title'
  const uniqueResults = Array.from(
    new Map(results.map((movie) => [movie.id || movie.title, movie])).values()
  );
  console.log("Unique Results:", uniqueResults); // Debugging log

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      {/* 🔙 Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/")}
          className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition"
        >
          ← Back
        </button>
      </div>

      {/* 🔎 Query Title */}
      <h2 className="text-2xl font-bold mb-4">
        {query ? `Results for "${query}"` : "Search Results"}
      </h2>

      {/* 🎬 Movie Results or Empty Message */}
      {uniqueResults.length > 0 ? (
        <MovieCard movies={uniqueResults} />
      ) : (
        <p className="text-gray-400 text-lg">No results found. Try searching something else.</p>
      )}
    </div>
  );
};

export default SearchResults;
