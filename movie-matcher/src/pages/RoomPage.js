import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { fetchAuthSession } from "@aws-amplify/auth";

const API_BASE_URL = "https://8qtloqt9pc.execute-api.us-east-2.amazonaws.com/dev/joinRoom-dev";

const RoomsPage = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens.idToken;
        const claims = idToken.payload;
        const username = claims["custom:userID"] || "User";

        const response = await fetch(`${API_BASE_URL}?roomId=${roomId}&username=${username}`);
        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.log("Error data:", errorData);
          throw new Error(errorData.error || "Failed to load room data.");
        }

        const result = await response.json();
        console.log("Raw result:", result);
        // The API returns a JSON string in result.body; we need to parse it.
        const data = JSON.parse(result.body);
        console.log("Parsed data:", data);
        // Set state to the inner roomData object instead of the entire response.
        setRoomData(data.roomData);
      } catch (error) {
        console.error("❌ Error fetching room data:", error);
        setErrorMessage(error.message);
      }
    };

    fetchRoomData();
  }, [roomId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <Header />
      <main className="w-full max-w-xl bg-white bg-opacity-10 rounded-lg p-8 shadow-lg">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : roomData ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl mb-4">Room Name: {roomId}</h2>
              <h3 className="text-xl mb-2">
                Host:{" "}
                {roomData.hostId && roomData.hostId.username
                  ? roomData.hostId.username
                  : roomData.hostId}
              </h3>
              <h3 className="text-xl mb-2">Members:</h3>
              <ul>
                {(roomData.members || []).map((member, index) => (
                  <li key={index}>{member}</li>
                ))}
              </ul>
              <h3 className="text-xl mb-2">
                Genre Filters:{" "}
                {roomData.genreFilter
                  ? roomData.genreFilter.join(", ")
                  : "No genre filters available"}
              </h3>
              <h3 className="text-xl mb-2">
                Streaming Service:{" "}
                {roomData.streamingService || "No streaming service available"}
              </h3>
            </div>
          </>
        ) : (
          <p>Loading room data...</p>
        )}
      </main>
    </div>
  );
};

export default RoomsPage;