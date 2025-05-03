import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMovies } from "../../context/MovieContext";
import { FaPlay, FaStar } from "react-icons/fa";
import { BsHeart, BsHeartFill } from "react-icons/bs";

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_KEY;

const MovieDetails = () => {
    const { selectedMovie, addToWatchHistory } = useMovies();

    const { likedMovies, toggleLike } = useMovies();
    const { id } = useParams();
    const navigate = useNavigate();
    const [trailerUrl, setTrailerUrl] = useState("");
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("userToken");
        if (!user) navigate("/login");
    }, [navigate]);


    useEffect(() => {
        setLiked(likedMovies.some((m) => m.id === selectedMovie.id));
    }, [likedMovies, selectedMovie.id]);

    useEffect(() => {
        const fetchTrailer = async () => {
            if (!selectedMovie?.title) return;

            try {
                const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
                    params: {
                        part: "snippet",
                        q: `${selectedMovie.title} official trailer`,
                        type: "video",
                        key: YOUTUBE_API_KEY,
                        maxResults: 1,
                    },
                });

                const videoId = res.data.items?.[0]?.id?.videoId;
                if (videoId) {
                    setTrailerUrl(`https://www.youtube.com/embed/${videoId}`);
                }
            } catch (err) {
                console.error("Trailer fetch error:", err.message);
            }
        };

        fetchTrailer();
    }, [selectedMovie]);

    const openTrailerInNewTab = () => {
        if (!trailerUrl) return;
        addToWatchHistory(selectedMovie);
        const videoId = trailerUrl.split("embed/")[1];
        const autoplayUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

        const trailerWindow = window.open("", "_blank");
        trailerWindow.document.write(`
            <html>
            <head>
                <title>Trailer</title>
                <style>
                    body {
                        margin: 0;
                        background: black;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    iframe {
                        border: none;
                        width: 960px;
                        height: 540px;
                        box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
                    }
                </style>
            </head>
            <body>
                <iframe src="${autoplayUrl}" allow="autoplay; fullscreen" allowfullscreen></iframe>
            </body>
            </html>
        `);
    };


    const handleLikeClick = () => {
        toggleLike(selectedMovie);
    };

    if (!selectedMovie) {
        return <div className="text-white text-center mt-10">Movie not found.</div>;
    }

    return (
        <div
            className="min-h-screen bg-black text-white p-8 flex items-center justify-center"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.5)), url(${selectedMovie.poster})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="max-w-6xl w-full flex flex-col md:flex-row gap-10">
                {/* Movie Poster */}
                <img
                    src={selectedMovie.poster || "https://via.placeholder.com/300x450?text=No+Poster"}
                    alt={selectedMovie.title}
                    className="w-72 rounded-lg shadow-xl"
                />

                {/* Movie Details */}
                <div className="flex flex-col space-y-4 max-w-3xl">
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-bold">{selectedMovie.title}</h1>
                        <button
                            onClick={handleLikeClick}
                            className="text-white bg-black p-2 rounded-full hover:scale-110 transition"
                            title={liked ? "Unlike" : "Like"}
                        >
                            {liked ? <BsHeartFill className="text-red-600" /> : <BsHeart />}
                        </button>

                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                        <span className="bg-red-600 px-2 py-1 rounded-md text-white">HD 4K</span>
                        <span>Genre: {selectedMovie.genre || selectedMovie.genre_names?.join(", ") || selectedMovie.genres || "Unknown"}</span>
                        <span>Year: {selectedMovie.year || selectedMovie.release_year|| "N/A"}</span>
                        <span>Runtime: {selectedMovie.runtime_minutes || selectedMovie.runtime || "N/A"} mins</span>
                        <span>Language: {selectedMovie.original_language === "hi" ? "Hindi" : selectedMovie.original_language === "en" ? "English" : selectedMovie.original_language || "Unknown"}</span>
                    </div>

                    <p className="text-gray-200 leading-relaxed">
                        {selectedMovie.plot_overview || selectedMovie.overview|| "No description available."}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={`text-yellow-400 ${i < Math.round((selectedMovie.user_rating||selectedMovie.imdb_rating || 0) / 2) ? "" : "opacity-20"}`}
                            />
                        ))}
                        <span className="ml-2 text-gray-400">{selectedMovie.imdbRating || selectedMovie.user_rating || selectedMovie.imdb_rating|| "N/A"}</span>
                    </div>

                    {/* Watch Trailer */}
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={openTrailerInNewTab}
                            className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-md flex items-center gap-2"
                        >
                            <FaPlay /> Watch Trailer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;