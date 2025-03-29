import axios from "axios";

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";


// Fetch movies by genre
export const fetchMoviesByGenre = async (genre) => {
    try {
        const response = await axios.get(`${BASE_URL}?s=${genre}&apikey=${API_KEY}`);
        if (response.data.Response === "True") {
            return response.data.Search;
        } else {
            console.error(`OMDb Error for ${genre}:`, response.data.Error);
            return [];
        }
    } catch (error) {
        console.error(`Error fetching ${genre} movies:`, error.message);
        return [];
    }
};

export const fetchMovieDetails = async (imdbId) => {
    try {
        const response = await axios.get(
            `https://www.omdbapi.com/?i=${imdbId}&apikey=${API_KEY}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null;
    }
};
