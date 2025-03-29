// TrendingCarousel.jsx
import React from 'react';

const TrendingCarousel = ({ movies }) => {
    if (!movies || movies.length === 0) {
        return <p className="text-center text-gray-400">No trending movies available.</p>;
    }

    return (
        <div className="md:p-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-clip-text mb-4 font-[Poppins]">
                On Trend 🔥 
            </h2>
        <div
            className="w-full overflow-x-auto whitespace-nowrap md:p-1 scroll-smooth scroll-snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
            {movies?.map((movie, index) => (
                <div
                    key={index}
                    className="p-2 inline-block snap-start"
                >
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="
                            object-cover rounded-lg mx-1
                            aspect-[2/3] 
                            shadow-lg hover:scale-105 transition-transform
                            w-32 sm:w-40 md:w-48 lg:w-10rem"
                    />
                    <p className="mt-2 text-center text-sm sm:text-base">{movie.title}</p>
                </div>
            ))}
        </div>
        </div>
    );
};

export default TrendingCarousel;
