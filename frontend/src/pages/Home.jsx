import React, { useEffect, useState } from 'react';
import MovieList from '../components/Home/MovieList';
import SearchBar from '../components/Home/SearchBar';
import TrendingCarousel from '../components/Home/Carousel';
import { fetchMixedMovies } from '../api/watchMode';
import Sidebar from '../components/Home/Sidebar';
import { useNavigate } from 'react-router-dom';
// Importing the API call

const Home = () => {
    const userToken = localStorage.getItem("userToken"); // Check token directly
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate(); 

    const handleLogin = () => {
        navigate("/login");
    }

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const combinedMovies = await fetchMixedMovies();
                setMovies(combinedMovies);
            } catch (error) {
                console.error("Error fetching movies:", error.message);
            }
        };
        fetchMovies();
    }, []);




    return (
        <div className="home-container bg-black text-white min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            {!userToken && (
                <div className="absolute top-4 right-4">
                        <button onClick={handleLogin} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                            Login
                        </button>
                </div>
            )}
            <Sidebar />
            <SearchBar />
            <div className="w-full">
                <TrendingCarousel movies={movies} />
            </div>
            <div className="w-full mt-8 sm:mt-10 md:mt-12">
                <MovieList />
            </div>
        </div>
    );
};

export default Home;
