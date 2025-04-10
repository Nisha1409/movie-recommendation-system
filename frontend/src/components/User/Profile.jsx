import React, { useEffect, useState } from "react";
import { useMovies } from "../../context/MovieContext";
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const { likedMovies } = useMovies();
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormData({ username: parsed.username, email: parsed.email });
    }
  }, []);

  const handleEditToggle = () => setEditMode((prev) => !prev);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-white hover:text-red-400 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center border-b border-gray-700 pb-4">
          User Profile
        </h2>

        {/* Section 1: User Info */}
        <div className="bg-black rounded-lg p-6 shadow-lg flex flex-col sm:flex-row gap-6 sm:items-center" style={{
          background: "linear-gradient(135deg, #0d0d0d, #1a1a1a)",
        }}>

          {/* Avatar */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username || "guest"}`}
              alt="User Avatar"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-700 object-cover"
            />
          </div>



          {/* Info + Edit */}
          <div className="w-full space-y-4">
            <div>
              <label className="text-gray-400">Full Name</label>
              {editMode ? (
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-gray-800 text-white p-2 rounded w-full mt-1"
                />
              ) : (
                <div className="text-lg sm:text-xl">{user?.username}</div>
              )}
            </div>

            <div>
              <label className="text-gray-400">Email</label>
              {editMode ? (
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-800 text-white p-2 rounded w-full mt-1"
                />
              ) : (
                <div className="text-lg sm:text-xl">{user?.email}</div>
              )}
            </div>

            <div>
              <label className="text-gray-400">Joined</label>
              <div className="text-sm text-gray-300">
                {new Date(user?.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mt-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-700 px-4 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="bg-[#D2042D] px-4 py-1 rounded hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Liked Movies */}
        <div className="bg-black rounded-lg p-6 shadow-md" style={{
          background: "linear-gradient(135deg, #0d0d0d, #1a1a1a)", // consistent soft black
        }}>
          <h3 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
            ❤️ Liked Movies
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {likedMovies.length > 0 ? (
              likedMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-[#121212] p-2 rounded text-center cursor-pointer hover:scale-105 transition"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <img src={movie.poster} alt={movie.title} className="w-full h-40 object-cover rounded mb-2" />
                  <div className="text-sm">{movie.title}</div>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No liked movies yet.</div>
            )}
          </div>

        </div>

        {/* Section 3: Watch History */}
        <div className="bg-black rounded-lg p-6 shadow-md" style={{
          background: "linear-gradient(135deg, #0d0d0d, #1a1a1a)", // consistent soft black
        }}>
          <h3 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
            ⏱️ Watch History (Last 15 Days)
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
            {/* Replace with actual history */}
            <li>Avatar (2022) — 1st April</li>
            <li>Jawaan (2023) — 30th March</li>
            <li>Batman Begins — 28th March</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
