import axios from "axios";

const WATCHMODE_KEY = process.env.REACT_APP_WATCHMODE_KEY;
const OMDB_KEY = process.env.REACT_APP_OMDB_API_KEY;
const GOOGLE_CSE_KEY = process.env.REACT_APP_GOOGLE_CSE_API_KEY;
const GOOGLE_CX = process.env.REACT_APP_GOOGLE_CSE_CX;
const WATCHMODE_URL = "https://api.watchmode.com/v1";
const OMDB_URL = "https://www.omdbapi.com/";
const GOOGLE_CSE_URL = "https://www.googleapis.com/customsearch/v1";

// Fallback poster
const placeholderPoster = "https://via.placeholder.com/300x450?text=No+Poster";

// Function to fetch movie posters from Google Custom Search
const fetchGooglePoster = async (query) => {
    try {
        const response = await axios.get(GOOGLE_CSE_URL, {
            params: {
                key: GOOGLE_CSE_KEY,
                cx: GOOGLE_CX,
                q: `${query} movie poster`,
                searchType: "image",
                num: 1,
            },
        });
        return response.data.items?.[0]?.link || placeholderPoster;
    } catch (error) {
        console.error(`Google CSE poster fetch failed for ${query}:`, error.message);
        return placeholderPoster;
    }
};

// Function to fetch OMDb poster
const fetchOmdbPoster = async (imdb_id, title) => {
    try {
        const response = await axios.get(`${OMDB_URL}`, {
            params: {
                i: imdb_id,
                apikey: OMDB_KEY,
            },
        });
        if (response.data.Poster && response.data.Poster !== "N/A") {
            return response.data.Poster;
        } else {
            return await fetchGooglePoster(title);
        }
    } catch (err) {
        console.error(`OMDb poster fetch failed for ${title}:`, err.message);
        return await fetchGooglePoster(title);
    }
};

// Fetch recent Bollywood Hindi movies (all platforms)
const fetchBollywoodMovies = async () => {
    try {
        const response = await axios.get(`${WATCHMODE_URL}/list-titles/`, {
            params: {
                apiKey: WATCHMODE_KEY,
                languages: "hi",
                types: "movie",
                sort_by: "release_date_desc",
                limit: 12,
            },
        });

        const movies = response.data.titles || [];

        const moviesWithPosters = await Promise.all(
            movies.map(async (movie) => {
                const poster = movie.imdb_id
                    ? await fetchOmdbPoster(movie.imdb_id, movie.title)
                    : await fetchGooglePoster(movie.title);

                return {
                    ...movie,
                    poster,
                    release_date: movie.release_date || "1900-01-01", 
                    popularity: movie.popularity || 0, // Fallback for missing dates
                };
            })
        );

        return moviesWithPosters;
    } catch (error) {
        console.error("Error fetching Bollywood Hindi movies:", error.message);
        return [];
    }
};

// Fetch recent Hollywood English movies from Netflix and Amazon
const fetchHollywoodMovies = async () => {
    try {
        const response = await axios.get(`${WATCHMODE_URL}/list-titles/`, {
            params: {
                apiKey: WATCHMODE_KEY,
                languages: "en",
                types: "movie",
                source_ids: "203,26", // Netflix (203) and Amazon Prime (157)
                sort_by: "release_date_desc",
                limit: 14,
            },
        });

        const movies = response.data.titles || [];

        const moviesWithPosters = await Promise.all(
            movies.map(async (movie) => {
                const poster = movie.imdb_id
                    ? await fetchOmdbPoster(movie.imdb_id, movie.title)
                    : await fetchGooglePoster(movie.title);

                return {
                    ...movie,
                    poster,
                    release_date: movie.release_date || "1900-01-01", 
                    popularity: movie.popularity || 0,// Fallback for missing dates
                };
            })
        );

        return moviesWithPosters;
    } catch (error) {
        console.error("Error fetching Hollywood English movies:", error.message);
        return [];
    }
};

// Fetch and mix Bollywood and Hollywood movies by release date
export const fetchMixedMovies = async () => {
    try {
        const [bollywoodMovies, hollywoodMovies] = await Promise.all([
            fetchBollywoodMovies(),
            fetchHollywoodMovies(),
        ]);

        const allMovies = [...bollywoodMovies, ...hollywoodMovies];

        // Sort by release date and popularity
        const sortedMovies = allMovies
            .filter(movie => movie.release_date && !isNaN(new Date(movie.release_date)))
            .sort((a, b) => {
                // Sort by release date first
                const dateDiff = new Date(b.release_date) - new Date(a.release_date);
                
                // If dates are the same, sort by popularity
                if (dateDiff === 0) {
                    return (b.popularity || 0) - (a.popularity || 0);
                }
                
                return dateDiff;
            });

        return sortedMovies;
    } catch (error) {
        console.error("Error fetching mixed movies:", error.response?.data || error.message);
        return [];
    }
};

