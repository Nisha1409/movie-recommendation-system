import React, { useState } from "react";

const MovieCard = ({ movies }) => {
    const [visibleCount, setVisibleCount] = useState(12); // Number of movies shown initially
    const moviesToShow = movies.slice(0, visibleCount); // Limit displayed movies

    return (
        <div className="w-full p-4">
            {/* Grid Container */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {moviesToShow.map((movie, index) => (
                    <div
                        key={index}
                        className="bg-gray-900 rounded-2xl shadow-lg p-3 w-full"
                    >
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="object-cover rounded-lg w-full aspect-[2/3] shadow-lg hover:scale-105 transition-transform"
                        />
                        <h3 className="text-white text-lg font-semibold mt-2 truncate">
                            {movie.title || "Title"}
                        </h3>
                        <p className="text-gray-400 text-sm">{movie.genre || "Genre: N/A"}</p>
                        <p className="text-gray-400 text-sm">{movie.platform || "Platform: N/A"}</p>
                        <p className="text-gray-400 text-sm">{movie.language || "Language: N/A"}</p>
                    </div>
                ))}
            </div>

            {/* Show More Button */}
            {visibleCount < movies.length && (
                <div className="flex items-center justify-center my-6">
                <hr className="flex-grow border-t border-gray-600" />
                <button className="px-5 py-2 mx-4 text-white bg-white/5 backdrop-blur-md border border-gray-700 rounded-lg hover:bg-white/10 transition">
                    Show More
                </button>
                <hr className="flex-grow border-t border-gray-600" />
            </div>
            
            )}
        </div>
    );
};

export default MovieCard;
