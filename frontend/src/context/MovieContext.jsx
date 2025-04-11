import { createContext, useContext, useState, useEffect } from "react";
import {
  fetchBollywoodMoviesByPopularity,
  fetchHollywoodMoviesByPopularity,
  fetchBollywoodMoviesByDate,
  fetchHollywoodMoviesByDate,
  fetchMixedMoviesByDate,
  fetchHorrorMovies,
  fetchActionMovies,
  fetchComedyMovies,
  fetchMovieBySearch,
} from "../api/watchMode";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [bollywoodMoviesPopularity, setBollywoodMoviesPopularity] = useState([]);
  const [hollywoodMoviesPopularity, setHollywoodMoviesPopularity] = useState([]);
  const [hollywoodMoviesDate, setHollywoodMoviesDate] = useState([]);
  const [bollywoodMoviesDate, setBollywoodMoviesDate] = useState([]);
  const [mixedMoviesDate, setMixedMoviesDate] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchedQueries, setSearchedQueries] = useState(new Map()); // Cache for search queries

  const [loading, setLoading] = useState(true);
  const [likedMovies, setLikedMovies] = useState(() => {
    const stored = localStorage.getItem("likedMovies");
    return stored ? JSON.parse(stored) : [];
  });

  // Toggle like for a movie
  const toggleLike = (movie) => {
    setLikedMovies((prev) => {
      const isLiked = prev.find((m) => m.id === movie.id);
      const updated = isLiked
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];
      localStorage.setItem("likedMovies", JSON.stringify(updated));
      return updated;
    });
  };

  // Fetch movies when the app loads
  useEffect(() => {
    const loadMovies = async () => {
      const bollywoodPopularityData = await fetchBollywoodMoviesByPopularity();
      const bollywoodDateData = await fetchBollywoodMoviesByDate();
      const mixedMoviesData = await fetchMixedMoviesByDate();
      const hollywoodDateData = await fetchHollywoodMoviesByDate();
      const hollywoodPopularityData = await fetchHollywoodMoviesByPopularity();
      const horrorMoviesData = await fetchHorrorMovies();
      const comedyMoviesData = await fetchComedyMovies();
      const actionMoviesData = await fetchActionMovies();

      setBollywoodMoviesPopularity(bollywoodPopularityData);
      setHollywoodMoviesPopularity(hollywoodPopularityData);
      setHollywoodMoviesDate(hollywoodDateData);
      setBollywoodMoviesDate(bollywoodDateData);
      setMixedMoviesDate(mixedMoviesData);
      setHorrorMovies(horrorMoviesData);
      setComedyMovies(comedyMoviesData);
      setActionMovies(actionMoviesData);
      setLoading(false);
    };

    if (
      bollywoodMoviesPopularity.length === 0 ||
      hollywoodMoviesPopularity.length === 0 ||
      hollywoodMoviesDate.length === 0 ||
      bollywoodMoviesDate.length === 0 ||
      mixedMoviesDate.length === 0 ||
      horrorMovies.length === 0 ||
      comedyMovies.length === 0 ||
      actionMovies.length === 0
    ) {
      loadMovies();
    }
  }, []);

  // Handle search logic
  const handleSearch = async (query) => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return;

    setSearchQuery(trimmedQuery);

    // 1️⃣ Check if the query is already cached
    if (searchedQueries.has(trimmedQuery)) {
      console.log(`Using cached results for query: "${trimmedQuery}"`);
      setSearchResults(searchedQueries.get(trimmedQuery));
      return;
    }

    // 2️⃣ Fetch results from Watchmode API
    try {
      console.log(`Fetching results from Watchmode API for query: "${trimmedQuery}"`);
      const results = await fetchMovieBySearch(trimmedQuery);

      if (results.length === 0) {
        console.warn(`No results found for query: "${trimmedQuery}"`);
      }

      setSearchedQueries((prev) => new Map(prev).set(trimmedQuery, results));
      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err.message);
    }
  };

  return (
    <MovieContext.Provider
      value={{
        bollywoodMoviesPopularity,
        hollywoodMoviesPopularity,
        hollywoodMoviesDate,
        bollywoodMoviesDate,
        mixedMoviesDate,
        horrorMovies,
        comedyMovies,
        actionMovies,
        likedMovies,
        toggleLike,
        selectedMovie,
        setSelectedMovie,
        loading,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        handleSearch, // Expose handleSearch
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => useContext(MovieContext);