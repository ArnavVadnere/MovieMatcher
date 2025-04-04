import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import Header from "../components/Header";
import { getCurrentUser, fetchAuthSession } from "@aws-amplify/auth";
import { GENRES, STREAMING_SERVICES } from "../constants";
import { createRoom } from "../graphql/mutations";

// Generate short room ID like "ABCD"
const generateRoomCode = (length = 4) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const HomePage = () => {
  const client = generateClient();
  const navigate = useNavigate();
  const [roomSettings, setRoomSettings] = useState({
    maxUsers: 4,
    genreFilter: [],
    streamingService: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateRoom = async () => {
    setErrorMessage("");

    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      const claims = session.tokens.idToken.payload;
      const username = claims["custom:userID"] || "UnknownUser";

      const roomCode = generateRoomCode();

      const response = await client.graphql({
        query: createRoom,
        variables: {
          input: {
            id: roomCode, // use short code as ID
            hostUsername: username,
            hostId: user.username,
            maxUsers: parseInt(roomSettings.maxUsers),
            genreFilter: roomSettings.genreFilter,
            streamingService: roomSettings.streamingService,
          },
        },
      });

      const data = response.data.createRoom;
      console.log("Room Created:", data);
      navigate(`/room/${data.id}`);
    } catch (error) {
      console.error("Error creating room:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <Header />
      <section className="w-full max-w-2xl bg-white bg-opacity-10 rounded-lg p-8 shadow-lg text-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Set Up Your Room
          </h2>
          <div className="mb-6">
            <label className="block text-lg mb-2 text-gray-200">
              Max Users:
            </label>
            <select
              value={roomSettings.maxUsers}
              onChange={(e) =>
                setRoomSettings({ ...roomSettings, maxUsers: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-purple-700 bg-opacity-50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[2, 4, 6, 8, 10].map((num) => (
                <option key={num} value={num} className="text-black">
                  {num}
                </option>
              ))}
            </select>
          </div>
          <fieldset className="mb-6">
            <legend className="text-lg mb-2 text-gray-200">
              Filter by Genre:
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {GENRES.map((genre) => (
                <label
                  key={genre}
                  className="flex items-center bg-white bg-opacity-20 p-2 rounded-lg hover:bg-opacity-30 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={genre}
                    onChange={() => {
                      const selected = roomSettings.genreFilter.includes(genre)
                        ? roomSettings.genreFilter.filter((g) => g !== genre)
                        : [...roomSettings.genreFilter, genre];
                      setRoomSettings({
                        ...roomSettings,
                        genreFilter: selected,
                      });
                    }}
                    className="mr-2"
                    checked={roomSettings.genreFilter.includes(genre)}
                  />
                  {genre}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mb-6">
            <label className="block text-lg mb-2 text-gray-200">
              Preferred Streaming Service:
            </label>
            <select
              value={roomSettings.streamingService}
              onChange={(e) =>
                setRoomSettings({
                  ...roomSettings,
                  streamingService: e.target.value,
                })
              }
              className="w-full p-3 rounded-lg bg-purple-700 bg-opacity-50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="text-black">
                Select a Service
              </option>
              {STREAMING_SERVICES.map((service) => (
                <option key={service} value={service} className="text-black">
                  {service}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreateRoom}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300"
          >
            Create Room
          </button>
          {errorMessage && (
            <p className="mt-4 text-red-500 font-bold">{errorMessage}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
