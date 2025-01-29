import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { signUp, confirmSignUp, getCurrentUser } from "@aws-amplify/auth";
import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports"; // Adjust path if necessary
import Header from "../components/Header"; 

Amplify.configure(awsExports);

const SignUpPage = () => {
  const navigate = useNavigate(); // ✅ Create navigate function
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  useEffect(() => {
      const checkUser = async () => {
        try {
          const user = await getCurrentUser();
          if (user) {
            navigate("/"); // Redirect to Landing Page if already signed in
          }
        } catch (error) {
          console.log("User not signed in");
        }
      };
  
      checkUser();
    }, [navigate]);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await signUp({
        username: email, // Use email as the Cognito-required username
        password,
        options: {
          userAttributes: {
            email, // Required
            "custom:userID": username, // Store custom username as an attribute
            "custom:firstLoginReal": "true", // Track first-time login
          },
        },
      });
      setSuccessMessage("Sign-up successful! Check your email for a verification code.");
      setIsConfirming(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error during sign-up:", error);
      setErrorMessage(error.message || "An error occurred during sign-up.");
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode,
      });
      setSuccessMessage("Account confirmed! Redirecting to login...");
      setErrorMessage("");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <Header />
      <div className="w-full max-w-md bg-white bg-opacity-10 rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl mb-4 text-center">Sign Up</h2>

        {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}

        {!isConfirming ? (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mb-6 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSignUp}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter Confirmation Code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleConfirmSignUp}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Confirm Account
            </button>
          </>
        )}
      </div>

      <div className="mt-8 text-center">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-500 underline transition duration-300">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
