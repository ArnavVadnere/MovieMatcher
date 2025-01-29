import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, signOut, fetchAuthSession } from "@aws-amplify/auth";

const UserMenu = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();

        const session = await fetchAuthSession(); // ✅ Fetch broader user session

        const idToken = session.tokens.idToken; // Extract ID token
        const claims = idToken.payload; // ✅ Claims contain user attributes

        setUserID(claims["custom:userID"] || "User"); // ✅ Extract custom userID
      } catch (error) {
        console.error("Error fetching user attributes:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ global: true }); 
  
      localStorage.clear();
      sessionStorage.clear();
  
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!userID) return null; 

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="font-bold">{userID || "User"}</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 7.707a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
          <button
            onClick={() => navigate("/preferences")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Profile
          </button>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
