import React, { useState, useEffect } from "react";
import { fetchAuthSession, signOut, updateUserAttribute } from "@aws-amplify/auth";
import Header from "../components/Header";
import { GENRES, STREAMING_SERVICES } from "../constants"; // ✅ Uses centralized constants
import { useNavigate } from "react-router-dom";

const PreferencesPage = () => {
  const navigate = useNavigate();
  const [userID, setUserID] = useState("User");
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState({
    favoriteGenres: [],
    streamingServices: [],
    newUsername: "",
  });

  // ✅ Fetch current user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await fetchAuthSession(); // ✅ Fetch broader user session
        const idToken = session.tokens.idToken; // Extract ID token
        const claims = idToken.payload; // ✅ Claims contain user attributes

        setUserID(claims["custom:userID"] || "User"); // ✅ Extract custom userID
        setEmail(claims["email"] || "N/A"); // ✅ Extract user email
      } catch (error) {
        console.error("❌ Error fetching user session:", error);
        navigate("/login"); // Redirect to login if session fails
      }
    };

    fetchUser();
  }, [navigate, preferences.newUsername]);

  // ✅ Handle Checkbox Change
  const handleCheckboxChange = (type, value) => {
    setPreferences((prev) => {
      const updatedArray = prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value];
      return { ...prev, [type]: updatedArray };
    });
  };

  const handleSavePreferences = async () => {
    if (!preferences.newUsername.trim() & (preferences.newUsername !== userID)) {
      alert("Please enter a valid username.");
      return;
    }

    try {
      console.log("🔄 Updating username to:", preferences.newUsername);
      const output = await updateUserAttribute({
            userAttribute: {
                attributeKey: "custom:userID",
                value: preferences.newUsername
            }
        });

      console.log("✅ Update Response:", output);
      handleUpdateUserAttributeNextSteps(output);

      alert("Username updated successfully!");
    } catch (error) {
      console.error("❌ Error updating username:", error);
      alert("Failed to update username. Please try again.");
    }
  };

  // ✅ Handle different update steps (e.g., if a confirmation code is needed)
  function handleUpdateUserAttributeNextSteps(output) {
    const { nextStep } = output;

    switch (nextStep.updateAttributeStep) {
        case "CONFIRM_ATTRIBUTE_WITH_CODE":
            console.log(`Confirmation code was sent to ${nextStep.codeDeliveryDetails?.deliveryMedium}.`);
            // Handle code confirmation if necessary.
            break;
        case "DONE":
            console.log("✅ Attribute was successfully updated.");
            break;
        default:
            console.log("❓ Unknown update step:", nextStep);
    }
  }

  // ✅ Handle Sign Out
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <Header />

      <section className="w-full max-w-2xl bg-white bg-opacity-10 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Profile & Preferences</h2>

        {/* ✅ User Info Section */}
        <div className="mb-6 text-center">
          <h3 className="text-xl font-semibold mb-2">User Info</h3>
          <p className="text-lg">Username: <span className="font-bold">{userID}</span></p>
          <p className="text-lg">Email: <span className="font-bold">{email}</span></p>
        </div>

        {/* ✅ Favorite Genres */}
        <fieldset className="mb-6">
          <legend className="text-xl mb-3 font-semibold">Favorite Genres:</legend>
          <div className="grid grid-cols-2 gap-3">
            {GENRES.map((genre) => (
              <label
                key={genre}
                className="flex items-center bg-white bg-opacity-20 p-2 rounded-lg hover:bg-opacity-30 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={preferences.favoriteGenres.includes(genre)}
                  onChange={() => handleCheckboxChange("favoriteGenres", genre)}
                  className="mr-2"
                />
                {genre}
              </label>
            ))}
          </div>
        </fieldset>

        {/* ✅ Streaming Services */}
        <fieldset className="mb-6">
          <legend className="text-xl mb-3 font-semibold">Streaming Services:</legend>
          <div className="grid grid-cols-2 gap-3">
            {STREAMING_SERVICES.map((service) => (
              <label
                key={service}
                className="flex items-center bg-white bg-opacity-20 p-2 rounded-lg hover:bg-opacity-30 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={preferences.streamingServices.includes(service)}
                  onChange={() => handleCheckboxChange("streamingServices", service)}
                  className="mr-2"
                />
                {service}
              </label>
            ))}
          </div>
        </fieldset>


        {/* ✅ Change Username */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Change Username:</label>
          <input
            placeholder="Enter new password"
            value={preferences.newUsername}
            onChange={(e) => setPreferences((prev) => ({ ...prev, newUsername: e.target.value }))}
            className="w-full p-3 rounded-lg bg-purple-700 bg-opacity-50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ✅ Save Button */}
        <button
          onClick={handleSavePreferences}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300"
        >
          Save Preferences
        </button>

        {/* ✅ Logout Button */}
        <button
          onClick={handleSignOut}
          className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition duration-300"
        >
          Log Out
        </button>
      </section>
    </div>
  );
};

export default PreferencesPage;
