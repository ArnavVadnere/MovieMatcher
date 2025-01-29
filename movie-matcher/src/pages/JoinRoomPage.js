import React from "react";

const JoinRoomPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <header className="text-4xl font-bold mb-8">MovieMatcher</header>
      <section className="w-full max-w-screen-sm bg-white bg-opacity-10 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl mb-6">Join Room</h2>
        <form className="flex flex-col space-y-4">
          <label htmlFor="roomCode" className="text-lg">
            Enter Room Code:
          </label>
          <input
            type="text"
            id="roomCode"
            className="w-full p-2 bg-white bg-opacity-20 rounded-lg text-black"
          />
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300"
          >
            Join
          </button>
        </form>
      </section>
    </div>
  );
};

export default JoinRoomPage;
