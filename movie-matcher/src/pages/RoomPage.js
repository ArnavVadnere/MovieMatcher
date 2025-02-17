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
          roomId,
          username,
          userId: user.username,
        };

        // Call the custom joinRoom mutation using the generated client
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
      <main className="w-full max-w-xl bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 shadow-lg mt-10">
        {errorMessage ? (
          <div className="p-4 bg-red-500 rounded-lg">
            <p className="text-lg">{errorMessage}</p>
          </div>
        ) : roomData ? (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">Room: {roomId}</h1>
            <div>
              <h2 className="text-2xl font-semibold">Host</h2>
              <p className="text-lg">
                {roomData.hostUsername
                  ? roomData.hostUsername
                  : roomData.hostId}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Members</h2>
              <ul className="pl-5 list-disc text-lg">
                {(roomData.members || []).map((memberString, index) => {
                  const formattedString = memberString
                    .replace(/=/g, ":")
                    .replace(/(\w+):/g, '"$1":')
                    .replace(/:([^,}]+)/g, ':"$1"');
                  const member = JSON.parse(formattedString);
                  return (
                    <li key={index}>{member.username || member.userId}</li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Genre Filters</h2>
              <p className="text-lg">
                {roomData.genreFilter && roomData.genreFilter.length > 0
                  ? roomData.genreFilter.join(", ")
                  : "No genre filters available"}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Streaming Service</h2>
              <p className="text-lg">
                {roomData.streamingService
                  ? roomData.streamingService
                  : "No streaming service available"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-lg">Loading room data...</p>
        )}
      </main>
    </div>
  );
};

export default RoomsPage;
