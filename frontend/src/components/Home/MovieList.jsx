import React, { useEffect, useState } from "react";
import { fetchMoviesByGenre } from "../../api/omdb";

const MovieList = () => {
    const [horrorMovies, setHorrorMovies] = useState([]);
    const [comedyMovies, setComedyMovies] = useState([]);
    const [actionMovies, setActionMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            setHorrorMovies(await fetchMoviesByGenre("horror"));
            setComedyMovies(await fetchMoviesByGenre("comedy"));
            setActionMovies(await fetchMoviesByGenre("action"));
        };
        fetchMovies();
    }, []);

    return (
        <div>
            <h2>Horror Movies</h2>
            {horrorMovies.map((movie) => (
                <p key={movie.imdbID}>{movie.Title}</p>
            ))}

            <h2>Comedy Movies</h2>
            {comedyMovies.map((movie) => (
                <p key={movie.imdbID}>{movie.Title}</p>
            ))}

            <h2>Action Movies</h2>
            {actionMovies.map((movie) => (
                <p key={movie.imdbID}>{movie.Title}</p>
            ))}
        </div>
    );
};

export default MovieList;
