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
  fetchMoviePoster // ✅ Ensure this function exists
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
  const [searchedQueries, setSearchedQueries] = useState(new Map());

  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const userToken = localStorage.getItem("userToken") || "guest";

  const [likedMovies, setLikedMovies] = useState(() => {
    const stored = localStorage.getItem(`likedMovies_${userToken}`);
    return stored ? JSON.parse(stored) : [];
  });

  const [watchHistory, setWatchHistory] = useState(() => {
    const stored = localStorage.getItem(`watchHistory_${userToken}`);
    return stored ? JSON.parse(stored) : [];
  });

  const [recommendations, setRecommendations] = useState([]);

  const toggleLike = (movie) => {
    setLikedMovies((prev) => {
      const isLiked = prev.find((m) => m.id === movie.id);
      const updated = isLiked
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];
      localStorage.setItem(`likedMovies_${userToken}`, JSON.stringify(updated));
      return updated;
    });
  };

  const addToWatchHistory = (movie) => {
    setWatchHistory((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      const updated = [...prev, { ...movie, watchedAt: new Date() }];
      localStorage.setItem(`watchHistory_${userToken}`, JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        console.log("🔄 Fetching movie categories...");
        setLoading(true);
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
        console.log("✅ Movie categories fetched successfully!");
        setLoading(false);
      }
      catch (error) {
        console.error("❌ Error fetching category movies:", error);
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  const fetchRecommendations = async () => {
    if (!likedMovies.length && !watchHistory.length) {
      console.warn("⚠️ No liked movies or watch history found. Skipping recommendation fetch.");
      return;
    }

    console.log("🔄 Fetching recommendations...");
    setLoadingRecommendations(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          liked_movies: likedMovies,
          watch_history: watchHistory,
          top_n: 10,
        }),
      });

      if (!response.ok) {
        throw new Error(`❌ Failed to fetch recommendations: ${response.statusText}`);
      }

      let data = await response.json();
      console.log("🔥 API Response:", data);

      // ✅ Fetch posters for each movie using IMDb ID
      const moviesWithPosters = await Promise.all(data.map(async (movie) => {
        const posterUrl = await fetchMoviePoster(movie.imdb_id, movie.title);
        return { ...movie, poster: posterUrl || "https://via.placeholder.com/300x450?text=No+Poster" };
      }));

      setRecommendations(moviesWithPosters);
      console.log("🏆 Updated Recommendations with Posters:", moviesWithPosters);

    } catch (error) {
      console.error("❌ Error fetching recommendations:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    if (likedMovies.length || watchHistory.length) {
      fetchRecommendations();
    }
  }, [likedMovies, watchHistory]);

  useEffect(() => {
    console.log("🏆 Stored Recommendations in Context:", recommendations);
  }, [recommendations]);

  const handleSearch = async (query) => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return;

    setSearchQuery(trimmedQuery);

    if (searchedQueries.has(trimmedQuery)) {
      console.log(`Using cached results for query: "${trimmedQuery}"`);
      setSearchResults(searchedQueries.get(trimmedQuery));
      return;
    }

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

  const logout = () => {
    console.log("🚪 Logging out: Clearing user data...");
    localStorage.removeItem(`likedMovies_${userToken}`);
    localStorage.removeItem(`watchHistory_${userToken}`);
    setLikedMovies([]);
    setWatchHistory([]);
  };

  return (
    <MovieContext.Provider
      value={{
        handleSearch,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
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
        watchHistory,
        setWatchHistory,
        addToWatchHistory,
        logout,
        selectedMovie,
        setSelectedMovie,
        loading,
        fetchRecommendations,
        recommendations,
        loadingRecommendations,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => useContext(MovieContext);
