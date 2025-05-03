// TrendingCarousel.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../../context/MovieContext';
import { useNavigate } from 'react-router-dom';

const TrendingCarousel = ({ movies }) => {
    const { setSelectedMovie } = useMovies();
    const navigate = useNavigate();

    const handleClick = (movie) => {
        setSelectedMovie(movie);
        navigate(`/movie/${movie.id}`);
    };

    if (!movies || movies.length === 0) {
        return <p className="text-center text-gray-400">No trending movies available.</p>;
    }

    return (
        <div className="md:p-2">
            <div
                className="w-full overflow-x-auto whitespace-nowrap scroll-smooth scroll-snap-x snap-mandatory
               scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent custom-scrollbar flex gap-2"
            >
                {movies.map((movie, index) => (
                    <div
                        key={index}
                        onClick={() => handleClick(movie)}
                        className="p-2 inline-block snap-start w-32 sm:w-40 md:w-48 lg:w-10rem flex-shrink-0 flex flex-col items-center"
                    >
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="object-cover rounded-lg mx-1 aspect-[2/3] shadow-lg hover:scale-105 transition-transform w-full"
                        />
                        <p className="mt-2 text-center text-sm sm:text-base w-full h-12 overflow-hidden text-ellipsis whitespace-normal break-words">
                            {movie.title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingCarousel;

