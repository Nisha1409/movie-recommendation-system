import { createContext, useContext, useState, useEffect } from "react";
import { fetchBollywoodMoviesByPopularity, fetchHollywoodMoviesByPopularity,fetchBollywoodMoviesByDate,fetchHollywoodMoviesByDate,fetchMixedMoviesByDate,fetchHorrorMovies,fetchActionMovies,fetchComedyMovies } from "../api/watchMode";

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

  const [loading, setLoading] = useState(true);
  const [likedMovies, setLikedMovies] = useState(() => {
    const stored = localStorage.getItem("likedMovies");
    return stored ? JSON.parse(stored) : [];
  });

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

  useEffect(() => {
    // Fetch movies only once when the app loads
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
    if (bollywoodMoviesPopularity.length === 0 || hollywoodMoviesPopularity.length === 0 || hollywoodMoviesDate.length === 0 || bollywoodMoviesDate.length === 0 || mixedMoviesDate.length === 0 || horrorMovies.length === 0 || comedyMovies.length === 0 || actionMovies.length === 0) {
      loadMovies();
    }
  }, []);

  return (
    <MovieContext.Provider value={{ bollywoodMoviesPopularity, hollywoodMoviesPopularity,hollywoodMoviesDate, bollywoodMoviesDate,mixedMoviesDate,horrorMovies,comedyMovies,actionMovies,
      likedMovies,
      toggleLike,
      selectedMovie,setSelectedMovie,loading }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => useContext(MovieContext);