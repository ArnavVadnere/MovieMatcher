import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getCurrentUser } from "@aws-amplify/auth";
import { getRoom, listMembers } from "../graphql/queries";
import { deleteMember, createMember, updateRoom } from "../graphql/mutations";
import { onCreateMember, onUpdateRoom } from "../graphql/subscriptions";
import { generateClient } from "aws-amplify/api";

const RoomsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [members, setMembers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch current user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUserId(user.username);
      } catch (error) {
        console.error("❌ Error getting current user:", error);
      }
    };
    fetchUser();
  }, []);

  // Fetch room + members
  useEffect(() => {
    const client = generateClient();

    const fetchRoomAndMembers = async () => {
      try {
        const roomResult = await client.graphql({
          query: getRoom,
          variables: { id: roomId },
        });

        const room = roomResult.data.getRoom;
        setRoomData(room);

        const membersResult = await client.graphql({
          query: listMembers,
          variables: {
            filter: {
              roomId: { eq: roomId },
            },
          },
        });

        const uniqueMembers = dedupeMembers(
          membersResult.data.listMembers.items
        );
        setMembers(uniqueMembers);
      } catch (error) {
        console.error("❌ Error fetching room data:", error);
        setErrorMessage(error.errors?.[0]?.message || "Failed to load room.");
      }
    };

    if (roomId) {
      fetchRoomAndMembers();
    }
  }, [roomId]);

  // Subscribe to member creation (avoid duplicates)
  useEffect(() => {
    if (!roomId) return;
    const client = generateClient();

    const subscription = client.graphql({ query: onCreateMember }).subscribe({
      next: ({ data }) => {
        const newMember = data?.onCreateMember;
        if (!newMember || newMember.roomId !== roomId) return;

        setMembers((prev) => {
          const exists = prev.some((m) => m.userId === newMember.userId);
          return exists ? prev : [...prev, newMember];
        });
      },
      error: (err) => console.warn("⚠️ Subscription error:", err),
    });

    return () => subscription.unsubscribe();
  }, [roomId]);

  // Subscribe to selection start
  useEffect(() => {
    const client = generateClient();
    const subscription = client.graphql({ query: onUpdateRoom }).subscribe({
      next: ({ data }) => {
        const updatedRoom = data?.onUpdateRoom;
        if (updatedRoom?.id === roomId && updatedRoom.selectionStarted) {
          navigate(`/room/${roomId}/select`);
        }
      },
      error: (err) => {
        console.warn("⚠️ Room update subscription error:", err);
      },
    });

    return () => subscription.unsubscribe();
  }, [roomId]);

  // Only create current member if not already exists
  useEffect(() => {
    const createSelfMember = async () => {
      if (
        !roomData ||
        !currentUserId ||
        members.some((m) => m.userId === currentUserId)
      )
        return;

      const user = await getCurrentUser();
      const client = generateClient();

      try {
        await client.graphql({
          query: createMember,
          variables: {
            input: {
              roomId,
              userId: user.username,
              username: user.signInDetails?.loginId || "User",
            },
          },
        });

        console.log("✅ Created member record for self");
      } catch (err) {
        console.error("❌ Error creating self member:", err);
      }
    };

    createSelfMember();
  }, [roomData, currentUserId, members, roomId]);

  const isHost = roomData?.hostId === currentUserId;

  const handleRemoveMember = async (memberId) => {
    try {
      const client = generateClient();
      await client.graphql({
        query: deleteMember,
        variables: {
          input: { id: memberId },
        },
      });

      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (error) {
      console.error("❌ Error removing member:", error);
    }
  };

  const handleStartSelection = async () => {
    const client = generateClient();
    try {
      await client.graphql({
        query: updateRoom,
        variables: {
          input: {
            id: roomId,
            selectionStarted: true,
          },
        },
      });

      console.log("✅ Selection started for all users");
    } catch (err) {
      console.error("❌ Error starting selection:", err);
    }
  };

  const dedupeMembers = (arr) => {
    const seen = new Set();
    return arr.filter((m) => {
      if (seen.has(m.userId)) return false;
      seen.add(m.userId);
      return true;
    });
  };

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
                  members.map((member) => (
                    <li
                      key={member.id}
                      className="flex items-center justify-between bg-white bg-opacity-5 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {member.username
                            ? member.username.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <span className="text-lg">
                          {member.username || member.userId}
                        </span>
                      </div>
                      {isHost && member.userId !== currentUserId && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-400 hover:text-red-600 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
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
            {isHost && (
              <div className="pt-4">
                <button
                  onClick={handleStartSelection}
                  className="w-full py-3 mt-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg shadow-md transition duration-300"
                >
                  Start Selection
                </button>
              </div>
            )}
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
