import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { GENRES, STREAMING_SERVICES } from "../constants"; // ✅ Centralized Constants

const HomePage = () => {
  const navigate = useNavigate();
  const [roomSettings, setRoomSettings] = useState({
    maxUsers: 4,
    genreFilter: [],
    streamingService: "",
  });

  const handleCreateRoom = () => {
    console.log("Creating room with settings:", roomSettings);
    navigate("/room"); // Redirect to created room
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <Header />

      <section className="w-full max-w-2xl bg-white bg-opacity-10 rounded-lg p-8 shadow-lg text-center">
        {/* ✅ Room Setup Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 text-white">Set Up Your Room</h2>

          {/* Max Users - Styled Dropdown */}
          <div className="mb-6">
            <label className="block text-lg mb-2 text-gray-200">Max Users:</label>
            <select
              value={roomSettings.maxUsers}
              onChange={(e) => setRoomSettings({ ...roomSettings, maxUsers: e.target.value })}
              className="w-full p-3 rounded-lg bg-purple-700 bg-opacity-50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[2, 4, 6, 8, 10].map((num) => (
                <option key={num} value={num} className="text-black">
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Genre Filter - Uses Centralized Constants */}
          <fieldset className="mb-6">
            <legend className="text-lg mb-2 text-gray-200">Filter by Genre:</legend>
            <div className="grid grid-cols-2 gap-3">
              {GENRES.map((genre) => (
                <label
                  key={genre}
                  className="flex items-center bg-white bg-opacity-20 p-2 rounded-lg hover:bg-opacity-30 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={genre}
                    onChange={(e) => {
                      const selectedGenres = roomSettings.genreFilter.includes(genre)
                        ? roomSettings.genreFilter.filter((g) => g !== genre)
                        : [...roomSettings.genreFilter, genre];
                      setRoomSettings({ ...roomSettings, genreFilter: selectedGenres });
                    }}
                    className="mr-2"
                  />
                  {genre}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Streaming Service - Uses Centralized Constants */}
          <div className="mb-6">
            <label className="block text-lg mb-2 text-gray-200">Preferred Streaming Service:</label>
            <select
              value={roomSettings.streamingService}
              onChange={(e) => setRoomSettings({ ...roomSettings, streamingService: e.target.value })}
              className="w-full p-3 rounded-lg bg-purple-700 bg-opacity-50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="text-black">Select a Service</option>
              {STREAMING_SERVICES.map((service) => (
                <option key={service} value={service} className="text-black">
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Create Room Button */}
          <button
            onClick={handleCreateRoom}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300"
          >
            Create Room
          </button>
        </div>

        {/* ✅ Join Room Section - Now a Button that Redirects */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-white">Or Join an Existing Room</h2>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-md transition duration-300"
          >
            Join Room
          </button>
        </div>

      </section>
    </div>
  );
};

export default HomePage;
