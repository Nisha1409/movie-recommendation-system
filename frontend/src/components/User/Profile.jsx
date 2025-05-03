import React, { useEffect, useState } from "react";
import { useMovies } from "../../context/MovieContext";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });

  const { fetchRecommendations, likedMovies, watchHistory, setWatchHistory, setSelectedMovie } = useMovies();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormData({ username: parsed.username, email: parsed.email });
    }
  }, []);

  // ✅ Update recommendations dynamically
  useEffect(() => {
    fetchRecommendations();
  }, [likedMovies, watchHistory]);

  const handleEditToggle = () => setEditMode((prev) => !prev);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    setEditMode(false);
  };

  // ✅ Click movie to update `selectedMovie` and navigate correctly
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie); // ✅ Update movie in context
    navigate(`/movie/${movie.id}`); // ✅ Navigate to movie details page
  };

  // ✅ Clear entire watch history
  const clearWatchHistory = () => {
    setWatchHistory([]);
    localStorage.removeItem("watchHistory"); // ✅ Remove from local storage
  };

  // ✅ Remove individual movie from watch history
  const removeFromWatchHistory = (movieId) => {
    const updatedHistory = watchHistory.filter((movie) => movie.id !== movieId);
    setWatchHistory(updatedHistory);
    localStorage.setItem("watchHistory", JSON.stringify(updatedHistory)); // ✅ Update local storage
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Back Button */}
      <div className="mb-6">
        <button onClick={() => navigate("/")} className="flex items-center text-white hover:text-red-400 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* User Info Section */}
        <h2 className="text-3xl md:text-4xl font-bold text-center border-b border-gray-700 pb-4">User Profile</h2>
        {/* Section 1: User Info */}
        <div className="bg-black rounded-lg p-6 shadow-lg flex flex-col sm:flex-row gap-6 sm:items-center" style={{ background: "linear-gradient(135deg, #0d0d0d, #1a1a1a)" }}>
          <div className="flex-shrink-0 flex items-center justify-center">
            <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username || "guest"}`} alt="User Avatar" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-700 object-cover" />
          </div> {/* Info + Edit */}
          <div className="w-full space-y-4">
            <div> <label className="text-gray-400">Full Name</label> {editMode ? (<input name="username" value={formData.username} onChange={handleChange} className="bg-gray-800 text-white p-2 rounded w-full mt-1" />) : (<div className="text-lg sm:text-xl">{user?.username}</div>)}
            </div>
            <div> <label className="text-gray-400">Email</label> {editMode ? (<input name="email" value={formData.email} onChange={handleChange} className="bg-gray-800 text-white p-2 rounded w-full mt-1" />) : (<div className="text-lg sm:text-xl">{user?.email}</div>)}
            </div>
            <div> <label className="text-gray-400">Joined</label>
              <div className="text-sm text-gray-300">{new Date(user?.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Liked Movies Section */}
        <div className="bg-black rounded-lg p-6 shadow-md" style={{ background: "linear-gradient(135deg, #0d0d0d, #1a1a1a)" }}>
          <h3 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">❤️ Liked Movies</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {likedMovies.length > 0 ? (
              likedMovies.map((movie) => (
                <div key={movie.id} className="bg-[#121212] p-2 rounded text-center cursor-pointer hover:scale-105 transition"
                  onClick={() => handleMovieClick(movie)}>
                  <img src={movie.poster} alt={movie.title} className="w-full h-40 object-cover rounded mb-2" />
                  <div className="text-sm">{movie.title}</div>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No liked movies yet.</div>
            )}
          </div>
        </div>

        {/* Watch History Section */}
        <div className="bg-black rounded-lg p-6 shadow-md" style={{ background: "linear-gradient(135deg, #0d0d0d, #1a1a1a)" }}>
          <h3 className="text-2xl font-semibold border-b border-gray-700 pb-2 flex justify-between items-center">
            ⏱️ Watch History
            {watchHistory.length > 0 && (
              <button onClick={clearWatchHistory} className="bg-red-600 px-3 py-1 rounded-md text-white text-sm hover:bg-red-700">
                Clear All
              </button>
            )}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {watchHistory.length > 0 ? (
              watchHistory.map((movie) => (
                <div key={movie.id} className="relative bg-[#121212] p-2 rounded text-center cursor-pointer hover:scale-105 transition">
                  <button onClick={() => removeFromWatchHistory(movie.id)}
                    className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-red-600 transition">
                    <FaTimes />
                  </button>
                  <div onClick={() => handleMovieClick(movie)}>
                    <img src={movie.poster} alt={movie.title} className="w-full h-40 object-cover rounded mb-2" />
                    <div className="text-sm">{movie.title}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No movies watched yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
