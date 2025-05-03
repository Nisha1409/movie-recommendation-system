import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { useMovies } from "../../context/MovieContext";

const MovieCard = ({ movies }) => {
    const { setSelectedMovie } = useMovies();
    const navigate = useNavigate(); // ✅ Initialize navigate
    const [visibleCount, setVisibleCount] = useState(12); // Number of movies shown initially

    if (!Array.isArray(movies)) {
        console.error("MovieCard received invalid movies data:", movies);
        return null; // Prevent rendering if movies is not an array
    }

    const moviesToShow = movies.slice(0, visibleCount); // Limit displayed movies

    // ✅ Fix: Pass `movie` as a parameter
    const handleClick = (movie) => {
        setSelectedMovie(movie); // Store movie details in context
        navigate(`/movie/${movie.id}`); // Navigate to details page
    };

    return (
        <div className="w-full p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {moviesToShow.map((movie, index) => (
                    // console.log(movie.sources),
                    // console.log(movie.genre_names),
                    // console.log(movie),
                    <div
                        key={index}
                        onClick={() => handleClick(movie)} // ✅ Pass movie to handleClick
                        className="bg-gray-900 rounded-2xl shadow-lg p-3 w-full cursor-pointer"
                    >
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="object-cover rounded-lg w-full aspect-[2/3] shadow-lg hover:scale-105 transition-transform"
                        />
                        <h3 className="text-white text-lg font-semibold mt-2 truncate">
                            {movie.title || "Title"}
                        </h3>
                        <p className="text-gray-400 text-sm">{movie.genre_names?.join(", ") || "Genre: N/A"}</p>
                        
                        <p className="text-gray-400 text-sm">Language: {movie.original_language === "hi" ? "Hindi" : movie.original_language  === "en" ? "English" : movie.original_language|| "Unknown"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieCard;
