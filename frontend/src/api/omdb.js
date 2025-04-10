import axios from "axios";

const OMDB_KEY = process.env.REACT_APP_OMDB_API_KEY;
const OMDB_URL = "https://www.omdbapi.com/";
const placeholderPoster = "https://via.placeholder.com/300x450?text=No+Poster";

/**
 * Fetch movies dynamically based on a search query and sort by latest release date.
 * @param {string} searchQuery - Search keyword (e.g., "Bollywood", "Hollywood", "Horror").
 * @param {number} limit - Number of movies to fetch.
 * @returns {Array} - Sorted list of movies by release date (latest first).
 */
const fetchMovies = async (searchQuery, limit = 10) => {
    try {
        const response = await axios.get(OMDB_URL, {
            params: {
                s: searchQuery, // Search query
                type: "movie",
                apikey: OMDB_KEY
            }
        });

        if (response.data.Search) {
            // Fetch detailed data for each movie
            const moviesWithDetails = await Promise.all(
                response.data.Search.slice(0, limit).map(async (movie) => {
                    const details = await fetchMovieDetails(movie.imdbID);
                    return {
                        ...details,
                        Released: details.Released !== "N/A" ? new Date(details.Released) : null, // Convert release date
                        poster: details.Poster !== "N/A" ? details.Poster : placeholderPoster
                    };
                })
            );

            // Sort movies by release date (latest first)
            const sortedMovies = moviesWithDetails
                .filter(movie => movie.Released) // Exclude movies without a valid release date
                .sort((a, b) => b.Released - a.Released);

            return sortedMovies;
        } else {
            console.error(`No movies found for: ${searchQuery}`);
            return [];
        }
    } catch (error) {
        console.error(`Error fetching movies for ${searchQuery}:`, error.message);
        return [];
    }
};

/**
 * Fetch movie details by IMDb ID.
 * @param {string} imdbId - IMDb ID of the movie.
 * @returns {Object} - Movie details.
 */
export const fetchMovieDetails = async (imdbId) => {
    try {
        const response = await axios.get(OMDB_URL, {
            params: {
                i: imdbId,
                apikey: OMDB_KEY
            }
        });

        return response.data || {};
    } catch (error) {
        console.error(`Error fetching details for IMDb ID: ${imdbId}`, error.message);
        return {};
    }
};

// Fetch Bollywood movies sorted by latest release date
export const fetchBollywoodMoviesByDate = async (limit = 12) => {
    return await fetchMovies("Bollywood", limit);
};

// Fetch Hollywood movies sorted by latest release date
export const fetchHollywoodMoviesByDate = async (limit = 14) => {
    return await fetchMovies("Hollywood", limit);
};

// Fetch mixed movies (Bollywood + Hollywood) sorted by release date
export const fetchMixedMoviesByDate = async (limit = 25) => {
    try {
        const [bollywoodMovies, hollywoodMovies] = await Promise.all([
            fetchBollywoodMoviesByDate(limit),
            fetchHollywoodMoviesByDate(limit),
        ]);

        return [...bollywoodMovies, ...hollywoodMovies].sort((a, b) => b.Released - a.Released);
    } catch (error) {
        console.error("Error fetching mixed movies by date:", error.message);
        return [];
    }
};
