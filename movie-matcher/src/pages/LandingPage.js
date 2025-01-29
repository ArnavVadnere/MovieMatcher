import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">MovieMatcher Logo</h1>
        <h2 className="text-2xl">
          Find the perfect movie to watch with your friends!
        </h2>
      </div>
      <div className="w-full max-w-screen-sm bg-white bg-opacity-10 rounded-lg p-8 shadow-lg text-center">
        <h3 className="text-xl mb-4">Join Room</h3>
        <input
          type="text"
          placeholder="Enter Room Code"
          className="w-full p-2 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
        />
        <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300">
          Join
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
