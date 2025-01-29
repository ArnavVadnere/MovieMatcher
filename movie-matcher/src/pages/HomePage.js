import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <header className="text-4xl font-bold mb-8">MovieMatcher</header>
      <section className="w-full max-w-screen-lg bg-white bg-opacity-10 rounded-lg p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-8">
          <Link
            to="/create-room"
            className="bg-purple-600 hover:bg-purple-700 text-white py-4 px-8 rounded-lg text-lg shadow-md transition duration-300"
          >
            Create Room
          </Link>
          <Link
            to="/join-room"
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-lg text-lg shadow-md transition duration-300"
          >
            Join Room
          </Link>
        </div>
        <div className="my-8">
          <h2 className="text-2xl text-gray-300 mb-4">My Rooms:</h2>
          <ul className="text-white">
            <li>
              <Link to="/room">Room 1</Link>
            </li>
            <li>
              <Link to="/room">Room 2</Link>
            </li>
          </ul>
        </div>
        <div className="my-8">
          <h2 className="text-2xl text-gray-300 mb-4">My Preferences:</h2>
          <ul className="text-white">
            <li>
              Favorite Genres:{" "}
              <Link to="/preferences" className="text-blue-400">
                Edit
              </Link>
            </li>
            <li>
              Streaming Services:{" "}
              <Link to="/preferences" className="text-blue-400">
                Edit
              </Link>
            </li>
          </ul>
        </div>
        <Link to="/logout" className="text-blue-400 hover:underline mt-8">
          Log Out
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
