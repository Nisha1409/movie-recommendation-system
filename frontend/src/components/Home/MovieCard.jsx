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
                        <p className="text-gray-400 text-sm">{movie.sources && movie.sources.length > 0
                            ? `Platforms: ${movie.sources.map(source => source.name).join(", ")}`
                            : "Platform: N/A"}</p>
                        <p className="text-gray-400 text-sm">{movie.original_language || "Language: N/A"}</p>
                    </div>
                ))}
            </div>

            {/* Show More Button */}
            {visibleCount < movies.length && (
                <div className="flex items-center justify-center my-6">
                    <hr className="flex-grow border-t border-gray-600" />
                    <button
                        onClick={() => setVisibleCount(visibleCount + 12)} // ✅ Increase count
                        className="px-5 py-2 mx-4 text-white bg-white/5 backdrop-blur-md border border-gray-700 rounded-lg hover:bg-white/10 transition"
                    >
                        Show More
                    </button>
                    <hr className="flex-grow border-t border-gray-600" />
                </div>
            )}
        </div>
    );
};

export default MovieCard;
