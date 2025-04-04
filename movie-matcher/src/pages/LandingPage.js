import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser, fetchAuthSession } from "@aws-amplify/auth";
import Header from "../components/Header";
import { getRoom } from "../graphql/queries";
import { createMember } from "../graphql/mutations";

const LandingPage = () => {
  const client = generateClient();
  const [user, setUser] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.log("❌ No user logged in.");
        setUser(null);
      }
    };

    checkUser();
  }, []);

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setErrorMessage("Please enter a valid room code.");
      return;
    }

    try {
      // Step 1: Check if the room exists
      const roomResponse = await client.graphql({
        query: getRoom,
        variables: { id: roomCode },
      });

      const room = roomResponse.data.getRoom;
      if (!room) {
        setErrorMessage("Room not found.");
        return;
      }

      // Step 2: Add user as a member of the room
      const session = await fetchAuthSession();
      const claims = session.tokens.idToken.payload;
      const username = claims["custom:userID"] || "User";
      const currentUser = await getCurrentUser();

      await client.graphql({
        query: createMember,
        variables: {
          input: {
            roomId: roomCode,
            username: username,
            userId: currentUser.username,
            joinedAt: new Date().toISOString(),
          },
        },
      });

      console.log("✅ Joined room successfully:", roomCode);
      navigate(`/room/${roomCode}`);
    } catch (error) {
      console.error("❌ Error joining room:", error);
      setErrorMessage(
        error.errors?.[0]?.message || "An unexpected error occurred."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <div className="mb-8 text-center">
        <Header />
        <h2 className="text-2xl">
          Find the perfect movie to watch with your friends!
        </h2>
      </div>

      {user ? (
        <div className="w-full max-w-screen-sm bg-white bg-opacity-10 rounded-lg p-8 shadow-lg text-center">
          <h3 className="text-xl mb-4">Join Room</h3>
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
          />
          <button
            onClick={handleJoinRoom}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300 mb-4"
          >
            Join
          </button>

          {errorMessage && (
            <p className="text-red-500 font-bold mt-2">{errorMessage}</p>
          )}

          <h3 className="text-xl mb-4">Or</h3>
          <button
            onClick={() => navigate("/home")}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg shadow-md transition duration-300"
          >
            Create Room
          </button>
        </div>
      ) : (
        <div className="w-full max-w-screen-sm bg-white bg-opacity-10 rounded-lg p-8 shadow-lg text-center">
          <p className="text-lg mb-6">
            You must log in or sign up to access the app!
          </p>
          <div className="flex flex-col space-y-4">
            <Link
              to="/login"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg shadow-md transition duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
