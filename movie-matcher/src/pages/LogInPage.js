import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn, resetPassword, fetchUserAttributes, updateUserAttributes, getCurrentUser, fetchAuthSession } from "@aws-amplify/auth"; 
import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports"; 


Amplify.configure(awsExports);

const LogInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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



  const handleLogin = async () => {
    console.log("🔄 Attempting login...");

    try {
        console.log("🔹 Signing in user:", email);
        const user = await signIn({ username: email, password });
        console.log("✅ Login successful:", user);

        // ✅ Fetch user session
        console.log("🔹 Fetching user session...");
        const session = await fetchAuthSession();
        console.log("✅ User session retrieved:", session);

        // ✅ Extract user attributes from ID Token
        const idToken = session.tokens.idToken;
        const claims = idToken.payload;
        console.log("✅ Extracted user attributes:", claims);

        const isFirstLogin = claims["custom:firstLoginReal"] || "true";
        console.log("🔹 Is first login?", isFirstLogin);

        if (isFirstLogin === "true") {
          try {
            const user = await getCurrentUser();
          
            if (user) { 
              console.log("🔹 Updating first login status...");
              console.log("User Object:", user); // Add this line for debugging
          
              // Check for potential issues within the user object
              if (user) { 
                // Ensure user.attributes is not null or undefined
                await updateUserAttributes({
                  "custom:firstLoginReal": "false"
                });
                console.log("✅ First login flag updated successfully.");
                navigate("/preferences");
              } else {
                console.error("⚠️ User object or attributes are missing."); 
              }
            } else {
              console.log("⚠️ No user found. Skipping update.");
            }
          } catch (error) {
            console.error("❌ Error getting current user:", error);
            // Handle errors appropriately
          }
        } else {
            navigate("/");
            console.log("➡️ Redirecting to Home page...");
        }
    } catch (error) {
        console.error("❌ Login error:", error);
        setErrorMessage(error.message || "Login failed. Please check your credentials.");
    }
};

  

  
  

  const handleForgotPassword = async () => {
    try {
      await resetPassword({ username: forgotPasswordEmail });
      setForgotPasswordSuccess("Password reset email sent!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message || "Error sending reset password email.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">MovieMatcher Logo</h1>
      </div>

      <div className="w-full max-w-xs bg-white bg-opacity-10 rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl mb-4 text-center">Log In</h2>

        {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}

        {!showForgotPassword ? (
          <>
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
            <button
              onClick={handleLogin}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Log In
            </button>

            <p className="text-center mt-4">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-300 hover:text-blue-400 underline transition duration-300"
              >
                Forgot Password?
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl mb-4 text-center">Reset Password</h2>
            {forgotPasswordSuccess && <p className="text-green-500 mb-4 text-center">{forgotPasswordSuccess}</p>}
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleForgotPassword}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Send Reset Link
            </button>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="w-full mt-4 text-blue-300 hover:text-blue-400 underline transition duration-300"
            >
              Back to Login
            </button>
          </>
        )}
      </div>

      <div className="mt-8 text-center">
        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-300 hover:text-blue-400 underline transition duration-300">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogInPage;
