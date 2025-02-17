import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { fetchAuthSession, getCurrentUser } from "@aws-amplify/auth";
import { customJoinRoom } from "../graphql/mutations";
import { generateClient } from "aws-amplify/api";

const RoomsPage = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const client = generateClient();

    const fetchRoomData = async () => {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens.idToken;
        const claims = idToken.payload;
        const username = claims["custom:userID"] || "User";
        const user = await getCurrentUser();

        // Prepare input for the joinRoom mutation
        const joinRoomInput = {
          roomId: roomId,
          username: username,
          userId: user.username,
        };

        // Call the joinRoom mutation using the generated client
        const result = await client.graphql({
          query: customJoinRoom,
          variables: { input: joinRoomInput },
        });

        console.log("Mutation result:", result.data.customJoinRoom);
        setRoomData(result.data.customJoinRoom);
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
                  <li key={index}>
                    {member.username ? member.username : member}
                  </li>
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
