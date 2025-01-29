import React from "react";

const RoomsPage = () => {
  // Dummy data for room members
  const roomMembers = ["User1", "User2", "User3"]; // Replace with actual data from your application

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold">MovieMatcher</h1>
      </header>
      <main className="w-full max-w-xl bg-white bg-opacity-10 rounded-lg p-8 shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl mb-4">Room Name: Room 1</h2>
          <h3 className="text-xl mb-2">Members:</h3>
          <ul className="mb-4">
            {roomMembers.map((member, index) => (
              <li key={index} className="text-lg">
                {member}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl mb-4">Recommended Movies:</h2>
          {/* Example Movie Card */}
          <div className="flex mb-4">
            <div className="w-1/3 bg-white bg-opacity-20 rounded-lg overflow-hidden shadow-lg">
              <img
                src="thumbnail.jpg"
                alt="Movie Thumbnail"
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Movie 1</h3>
                <p className="text-sm mb-2">Genre: Action, Comedy</p>
                <p className="text-sm mb-2">Rating: ★★★★☆</p>
                <p className="text-sm mb-2">Available on: Netflix</p>
                <div className="flex justify-between">
                  <button className="py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300 text-base mr-2">
                    More Info
                  </button>
                  <button className="py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300 text-base">
                    Select
                  </button>
                </div>
              </div>
            </div>
            {/* Repeat for other recommended movies */}
          </div>
        </div>
        <div className="flex justify-between">
          <button className="py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300 text-lg mr-4">
            Load More Recommendations
          </button>
          <button className="py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300 text-lg">
            Watch Selected Movie
          </button>
        </div>
      </main>
      <footer className="mt-8 text-center">
        <button className="py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300 text-lg">
          Leave Room
        </button>
      </footer>
    </div>
  );
};

export default RoomsPage;
