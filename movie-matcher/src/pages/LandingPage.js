import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "@aws-amplify/auth";
import Header from "../components/Header";

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log("✅ User is logged in:", currentUser);
        setUser(currentUser);
      } catch (error) {
        console.log("❌ No user logged in.");
        setUser(null);
      }
    };

    checkUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <div className="mb-8 text-center">
        <Header />
        <h2 className="text-2xl">Find the perfect movie to watch with your friends!</h2>
      </div>

      {user ? (
        // ✅ Show "Join Room" and "Create Room" options if user is logged in
        <div className="w-full max-w-screen-sm bg-white bg-opacity-10 rounded-lg p-8 shadow-lg text-center">
          <h3 className="text-xl mb-4">Join Room</h3>
          <input
            type="text"
            placeholder="Enter Room Code"
            className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
          />
          <button
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300 mb-4"
          >
            Join
          </button>
          <h3 className="text-xl mb-4">Or</h3>
          <button
            onClick={() => navigate("/home")}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg shadow-md transition duration-300"
          >
            Create Room
          </button>
        </div>
      ) : (
        // ❌ Show "Login or Signup" message if user is NOT logged in
        <div className="w-full max-w-screen-sm bg-white bg-opacity-10 rounded-lg p-8 shadow-lg text-center">
          <p className="text-lg mb-6">You must log in or sign up to access the app!</p>
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
