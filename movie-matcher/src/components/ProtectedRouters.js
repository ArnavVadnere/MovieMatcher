import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@aws-amplify/auth";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.warn("No user logged in, redirecting to login.");
        setUser(null);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>; // Optional loading state
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
