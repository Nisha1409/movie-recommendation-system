import React, { useEffect, useState } from "react";
import { fetchBollywoodMovies, fetchHollywoodMovies } from "../../api/watchMode";
import MovieCard from "./MovieCard";
// import { fetchMoviesByGenre } from "../../api/omdb";

const MovieList = () => {
    const [horrorMovies, setHorrorMovies] = useState([]);
    const [comedyMovies, setComedyMovies] = useState([]);
    const [actionMovies, setActionMovies] = useState([]);
    const [bollywoodMovies, setBollywoodMovies] = useState([]);
    const [hollywoodMovies, setHollywoodMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
    
                // Fetch all movies from Watchmode
                const bollywoodMovies = await fetchBollywoodMovies(40);
                setBollywoodMovies(bollywoodMovies);
                const hollywoodMovies = await fetchHollywoodMovies(40);
                setHollywoodMovies(hollywoodMovies);
                console.log("Bollywood Movies:", bollywoodMovies);
                console.log("Hollywood Movies:", hollywoodMovies);
                
    
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
        fetchMovies();
    }, []);
    

    return (
        <div className="movie-list-container">
            {/* Horror Movies */}
            <h2 className="text-xl font-bold text-red-500">Horror Movies</h2>
            <MovieCard movies={horrorMovies} />

            {/* Comedy Movies */}
            <h2 className="text-xl font-bold text-yellow-500 mt-6">Comedy Movies</h2>
            <MovieCard movies={comedyMovies} />

            {/* Action Movies */}
            <h2 className="text-xl font-bold text-blue-500 mt-6">Action Movies</h2>
            <MovieCard movies={actionMovies} />

            {/* Bollywood Movies (Hindi) */}
            <h2 className="text-xl font-bold text-green-500 mt-6">Bollywood Movies (Hindi)</h2>
            <MovieCard movies={bollywoodMovies} />

            {/* Hollywood Movies (English, Netflix, Amazon) */}
            <h2 className="text-xl font-bold text-purple-500 mt-6">Hollywood Movies (Netflix, Amazon)</h2>
            <MovieCard movies={hollywoodMovies} />
        </div>
    );
};

export default MovieList;
