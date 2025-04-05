import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "@aws-amplify/auth";
import { createVote } from "../graphql/mutations";
import { onUpdateRoom } from "../graphql/subscriptions";
import Header from "../components/Header";

const mockMovies = [
  {
    id: "1",
    title: "Inception",
    poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
  },
  {
    id: "2",
    title: "The Matrix",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  },
  // Add more mock movies or fetch from backend
];

const SelectionPage = () => {
  const { roomId } = useParams();
  const [movies, setMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [matchedMovie, setMatchedMovie] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // For tracking swipe gestures
  const cardRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);

  const client = generateClient();

  useEffect(() => {
    // TODO: Replace with actual movie fetching logic
    setMovies(mockMovies);
  }, []);

  const handleVote = async (status) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Set swipe animation direction
    if (status === "liked") {
      setSwipeDirection("right");
    } else if (status === "passed") {
      setSwipeDirection("left");
    } else {
      setSwipeDirection("up");
    }

    // Start the animation first
    // Wait for animation to complete before advancing to next card
    setTimeout(async () => {
      try {
        // Only try to submit vote if we have the necessary data
        if (roomId && movies[currentMovieIndex]) {
          const movie = movies[currentMovieIndex];
          try {
            const user = await getCurrentUser();

            // Submit vote - handle this separately from the UI flow
            // Don't await this, just let it happen in the background
            client
              .graphql({
                query: createVote,
                variables: {
                  input: {
                    movieId: movie.id,
                    roomId,
                    userId: user.username,
                    status,
                  },
                },
              })
              .catch((error) => {
                console.error("❌ Error casting vote (non-blocking):", error);
                // Don't block the UI experience on API errors
              });
          } catch (userError) {
            console.error("❌ Error getting current user:", userError);
            // Still advance to next card even if we can't get the user
          }
        }

        // Always advance to next movie, even if vote submission fails
        setCurrentMovieIndex((prev) => prev + 1);
        setSwipeDirection(null);
        setIsTransitioning(false);
      } catch (err) {
        console.error("❌ Error in vote handling:", err);
        // Reset state even if there's an error
        setSwipeDirection(null);
        setIsTransitioning(false);
      }
    }, 500); // Extended duration to ensure animation completes
  };

  // Touch/mouse event handlers for swiping
  const handleTouchStart = (e) => {
    if (isTransitioning) return;

    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
    startY.current = e.touches ? e.touches[0].clientY : e.clientY;
    currentX.current = startX.current;
    currentY.current = startY.current;

    document.addEventListener(
      e.touches ? "touchmove" : "mousemove",
      handleTouchMove
    );
    document.addEventListener(
      e.touches ? "touchend" : "mouseup",
      handleTouchEnd
    );
  };

  const handleTouchMove = (e) => {
    if (isTransitioning) return;

    currentX.current = e.touches ? e.touches[0].clientX : e.clientX;
    currentY.current = e.touches ? e.touches[0].clientY : e.clientY;

    const deltaX = currentX.current - startX.current;
    const deltaY = currentY.current - startY.current;

    // Apply transform to the card
    if (cardRef.current) {
      const rotation = deltaX * 0.1; // Rotate slightly as user swipes
      cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;

      // Show indicators based on swipe direction
      if (deltaX > 50) {
        cardRef.current.classList.add("swipe-right-indicator");
        cardRef.current.classList.remove(
          "swipe-left-indicator",
          "swipe-up-indicator"
        );
      } else if (deltaX < -50) {
        cardRef.current.classList.add("swipe-left-indicator");
        cardRef.current.classList.remove(
          "swipe-right-indicator",
          "swipe-up-indicator"
        );
      } else if (deltaY < -50) {
        cardRef.current.classList.add("swipe-up-indicator");
        cardRef.current.classList.remove(
          "swipe-right-indicator",
          "swipe-left-indicator"
        );
      } else {
        cardRef.current.classList.remove(
          "swipe-right-indicator",
          "swipe-left-indicator",
          "swipe-up-indicator"
        );
      }
    }
  };

  const handleTouchEnd = () => {
    if (isTransitioning) return;

    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("mousemove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    document.removeEventListener("mouseup", handleTouchEnd);

    const deltaX = currentX.current - startX.current;
    const deltaY = currentY.current - startY.current;

    // Reset card position if swipe wasn't decisive
    if (cardRef.current) {
      cardRef.current.classList.remove(
        "swipe-right-indicator",
        "swipe-left-indicator",
        "swipe-up-indicator"
      );

      if (deltaX > 100) {
        // Swipe right - Like
        handleVote("liked");
      } else if (deltaX < -100) {
        // Swipe left - Pass
        handleVote("passed");
      } else if (deltaY < -100) {
        // Swipe up - Watched
        handleVote("watched");
      } else {
        // Reset if swipe wasn't decisive - use transition for smooth return
        cardRef.current.style.transition = "transform 0.3s ease-out";
        cardRef.current.style.transform = "";

        // Remove transition after it completes
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.transition = "";
          }
        }, 300);
      }
    }
  };

  useEffect(() => {
    const subscription = client
      .graphql({ query: onUpdateRoom, variables: { roomId } })
      .subscribe({
        next: ({ data }) => {
          const room = data?.onUpdateRoom;
          if (room?.matchedMovieId) {
            const match = movies.find((m) => m.id === room.matchedMovieId);
            if (match) {
              setMatchedMovie(match);
            }
          }
        },
        error: (err) => console.warn("Subscription error:", err),
      });

    return () => subscription.unsubscribe();
  }, [movies]);

  if (matchedMovie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
        <Header />
        <div className="animate-bounce-in">
          <h1 className="text-4xl font-bold mb-4">🎉 Movie Matched!</h1>
          <div className="relative overflow-hidden rounded-lg shadow-2xl">
            <img
              src={matchedMovie.poster}
              alt={matchedMovie.title}
              className="w-64 rounded-lg shadow-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <p className="text-2xl font-semibold">{matchedMovie.title}</p>
            </div>
          </div>
          <button className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-bold text-lg">
            🎬 Watch Now
          </button>
        </div>
      </div>
    );
  }

  const movie = movies[currentMovieIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <Header />
      <div className="relative w-full max-w-sm flex flex-col items-center">
        {movie ? (
          <>
            <div className="movie-card-container relative w-64 h-96">
              {/* Current Movie Card */}
              <div
                ref={cardRef}
                onTouchStart={handleTouchStart}
                onMouseDown={handleTouchStart}
                className={`movie-card absolute w-full h-full rounded-xl shadow-2xl transition-transform duration-300 ${
                  swipeDirection ? `swipe-${swipeDirection}` : ""
                } z-10`}
              >
                <div className="relative h-full rounded-xl overflow-hidden">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h2 className="text-2xl font-bold">{movie.title}</h2>
                  </div>

                  {/* Swipe indicators */}
                  <div className="like-indicator absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg transform rotate-12 opacity-0 transition-opacity font-bold text-lg">
                    LIKE
                  </div>
                  <div className="pass-indicator absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-lg transform -rotate-12 opacity-0 transition-opacity font-bold text-lg">
                    PASS
                  </div>
                  <div className="watched-indicator absolute top-6 left-0 right-0 mx-auto w-max bg-blue-500 text-white px-4 py-2 rounded-lg opacity-0 transition-opacity font-bold text-lg">
                    WATCHED
                  </div>
                </div>
              </div>

              {/* Preview of next card (if available) */}
              {currentMovieIndex + 1 < movies.length && (
                <div className="absolute w-full h-full rounded-xl shadow-xl z-0">
                  <div className="relative h-full rounded-xl overflow-hidden">
                    <img
                      src={movies[currentMovieIndex + 1].poster}
                      alt={movies[currentMovieIndex + 1].title}
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-8 mt-8">
              <button
                onClick={() => handleVote("passed")}
                className="p-4 bg-red-500 hover:bg-red-600 rounded-full text-2xl shadow-lg transform transition hover:scale-110"
                disabled={isTransitioning}
              >
                ❌
              </button>
              <button
                onClick={() => handleVote("watched")}
                className="p-4 bg-blue-500 hover:bg-blue-600 rounded-full text-2xl shadow-lg transform transition hover:scale-110"
                disabled={isTransitioning}
              >
                👀
              </button>
              <button
                onClick={() => handleVote("liked")}
                className="p-4 bg-green-500 hover:bg-green-600 rounded-full text-2xl shadow-lg transform transition hover:scale-110"
                disabled={isTransitioning}
              >
                ❤️
              </button>
            </div>

            <p className="mt-6 text-lg">
              {currentMovieIndex + 1} of {movies.length}
            </p>

            <div className="mt-4 text-sm text-gray-300">
              Swipe left to pass, right to like, up for watched
            </div>
          </>
        ) : (
          <div className="text-center p-8 bg-gray-800 bg-opacity-50 rounded-lg">
            <p className="text-xl italic mb-4">You're out of movies!</p>
            <p>Check back later for more recommendations</p>
          </div>
        )}
      </div>

      {/* Add CSS for swipe animations */}
      <style>{`
        .movie-card {
          cursor: grab;
          will-change: transform;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        
        .movie-card:active {
          cursor: grabbing;
        }
        
        .swipe-left {
          transform: translateX(-150%) rotate(-20deg) !important;
          opacity: 0;
        }
        
        .swipe-right {
          transform: translateX(150%) rotate(20deg) !important;
          opacity: 0;
        }
        
        .swipe-up {
          transform: translateY(-150%) rotate(5deg) !important;
          opacity: 0;
        }
        
        .swipe-left-indicator .pass-indicator,
        .swipe-right-indicator .like-indicator,
        .swipe-up-indicator .watched-indicator {
          opacity: 1;
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.6s;
        }
        
        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        /* Add a small animation for the next card reveal */
        .movie-card-container {
          perspective: 1000px;
        }
        
        @keyframes revealNextCard {
          from {
            transform: scale(0.95);
            opacity: 0.5;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SelectionPage;
