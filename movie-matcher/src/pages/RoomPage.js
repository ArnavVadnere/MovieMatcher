import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { getRoom } from "../graphql/queries";
import { onCreateMember } from "../graphql/subscriptions";
import { generateClient } from "aws-amplify/api";

const RoomsPage = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [members, setMembers] = useState([]);

  // Fetch room data on load
  useEffect(() => {
    const client = generateClient();

    const fetchRoomData = async () => {
      try {
        const result = await client.graphql({
          query: getRoom,
          variables: { id: roomId },
        });

        const room = result.data.getRoom;
        setRoomData(room);

        if (room.members?.items) {
          setMembers(room.members.items);
        }
      } catch (error) {
        console.error("❌ Error fetching room data:", error);
        setErrorMessage(error.errors?.[0]?.message || "Failed to load room.");
      }
    };

    if (roomId) {
      fetchRoomData();
    }
  }, [roomId]);

  // Subscribe to new member creation for this room
  useEffect(() => {
    if (!roomId) return;

    const client = generateClient();

    console.log("Subscribing to member creation events...");
    const subscription = client
      .graphql({
        query: onCreateMember,
      })
      .subscribe({
        next: ({ data }) => {
          const newMember = data?.onCreateMember;
          if (!newMember || newMember.roomId !== roomId) return;

          console.log("🟢 New member joined:", newMember);

          setMembers((prev) => {
            if (prev.some((m) => m.userId === newMember.userId)) return prev;
            return [...prev, newMember];
          });
        },
        error: (error) => {
          console.warn("⚠️ Subscription error:", error);
        },
      });

    return () => {
      console.log("Unsubscribing from member updates...");
      subscription.unsubscribe();
    };
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
                {roomData.hostUsername || roomData.hostId}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Members</h2>
              <ul className="pl-5 space-y-2">
                {members.length > 0 ? (
                  members.map((member, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 bg-white bg-opacity-5 rounded-lg p-3 transition-all hover:bg-opacity-10"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {member.username
                          ? member.username.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                      <span className="text-lg">
                        {member.username || member.userId}
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="text-white text-opacity-70 italic">
                    No members have joined yet
                  </p>
                )}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Genre Filters</h2>
              <p className="text-lg">
                {roomData.genreFilter?.length
                  ? roomData.genreFilter.join(", ")
                  : "No genre filters available"}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Streaming Service</h2>
              <p className="text-lg">
                {roomData.streamingService || "No streaming service available"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-6">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RoomsPage;
