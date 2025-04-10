import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

const MovieList = ({bollywoodMoviesDate,hollywoodMoviesDate,horrorMovies,actionMovies,comedyMovies}) => {
   

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
            <MovieCard movies={bollywoodMoviesDate} />

            {/* Hollywood Movies (English, Netflix, Amazon) */}
            <h2 className="text-xl font-bold text-purple-500 mt-6">Hollywood Movies (Netflix, Amazon)</h2>
            <MovieCard movies={hollywoodMoviesDate} />
        </div>
    );
};

export default MovieList;
