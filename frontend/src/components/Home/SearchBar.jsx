import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { ImSpinner6 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { useMovies } from "../../context/MovieContext";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("Search for movies...");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { handleSearch } = useMovies();

  useEffect(() => {
    const handleResize = () => {
      setPlaceholder(window.innerWidth < 640 ? "Search" : "Search for movies...");
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);  // ✅ Activate loading state
    await handleSearch(query);
    setIsLoading(false); // Call handleSearch from context
    navigate("/search"); // Navigate to SearchResults page
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center justify-center w-full my-8 sm:px-6 md:px-8"
      style={{ marginTop: "80px", zIndex: 1 }}
    >
      <div className="relative w-3/4 sm:w-2/3 lg:w-1/2">
        <input
          type="text"
          placeholder={placeholder}
          className="p-3 pl-4 pr-12 w-full rounded-full outline-none bg-[#121212] text-white placeholder-gray-400"
          value={query}
          disabled={isLoading}
          onChange={(e) => setQuery(e.target.value)}
          style={{ height: "45px", fontSize: "1rem" }}
        />
        <button
          type="submit"
          className={`absolute right-[0.15rem] top-1/2 transform -translate-y-1/2 bg-[#df0707] p-2 rounded-full shadow-md transition-all duration-300 flex items-center justify-center md:w-[80px] w-[40px] ${isLoading ? "bg-gray-500 cursor-not-allowed" : "hover:bg-red-600"
            }`}
          style={{ height: "40px" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ImSpinner6 className="text-white w-5 h-5 animate-spin" /> // Spinner icon
          ) : (
            <>
              <span className="hidden md:block">Search</span>
              <FiSearch className="text-white md:hidden w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
