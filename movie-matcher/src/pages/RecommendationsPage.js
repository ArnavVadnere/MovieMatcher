import React, { useState } from "react";
import { Link } from "react-router-dom";

const RecommendationsPage = () => {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  const movies = [
    {
      id: 1,
      title: "Movie 1",
      genre: ["Action", "Comedy"],
      rating: "★★★★☆",
      streaming: "Netflix",
      thumbnail: "thumbnail1.jpg",
    },
    {
      id: 2,
      title: "Movie 2",
      genre: ["Drama", "Romance"],
      rating: "★★★☆☆",
      streaming: "Hulu",
      thumbnail: "thumbnail2.jpg",
    },
    {
      id: 3,
      title: "Movie 3",
      genre: ["Sci-Fi", "Adventure"],
      rating: "★★★★☆",
      streaming: "Prime Video",
      thumbnail: "thumbnail3.jpg",
    },
    {
      id: 4,
      title: "Movie 4",
      genre: ["Thriller", "Mystery"],
      rating: "★★★☆☆",
      streaming: "Disney+",
      thumbnail: "thumbnail4.jpg",
    },
    // Add more movies as needed
  ];

  // const onSwipe = (direction, movieId) => {
  //   console.log("You swiped: " + direction + " on movie id: " + movieId);
  //   // Handle swipe action here (e.g., update state, make API call)
  //   if (direction === "right" || direction === "up") {
  //     // Move to the next movie
  //     setCurrentMovieIndex((prevIndex) =>
  //       prevIndex < movies.length - 1 ? prevIndex + 1 : prevIndex
  //     );
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold">MovieMatcher</h1>
      </header>
      <main className="w-full max-w-xl bg-white bg-opacity-10 rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl mb-4">Recommendations</h2>
        <div className="relative">
          {currentMovieIndex < movies.length && (
            <div className="bg-white bg-opacity-20 rounded-lg overflow-hidden shadow-lg">
              <img
                src={movies[currentMovieIndex].thumbnail}
                alt={`Thumbnail for ${movies[currentMovieIndex].title}`}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  {movies[currentMovieIndex].title}
                </h3>
                <p className="text-sm mb-2">
                  Genre: {movies[currentMovieIndex].genre.join(", ")}
                </p>
                <p className="text-sm mb-2">
                  Rating: {movies[currentMovieIndex].rating}
                </p>
                <p className="text-sm mb-2">
                  Available on: {movies[currentMovieIndex].streaming}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Link
        to="/"
        className="mt-8 text-center text-blue-400 hover:text-blue-500"
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default RecommendationsPage;
