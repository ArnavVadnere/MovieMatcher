/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */ const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME =
  process.env.STORAGE_MOVIEMATCHERROOMSTABLE_NAME || "RoomsTable-dev";

const generateShortRoomId = () => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

const checkRoomExists = async (roomCode) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { roomId: roomCode },
  };
  const result = await dynamo.get(params).promise();
  return result.Item !== undefined;
};

exports.handler = async (event) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    // Get input from GraphQL arguments
    const { hostUsername, hostId, maxUsers, genreFilter, streamingService } =
      event.arguments.input;

    // Validate required fields
    if (!hostId || !maxUsers) {
      throw new Error("Missing required fields");
    }

    // Generate a unique 4-digit room code
    let roomCode;
    do {
      roomCode = generateShortRoomId();
    } while (await checkRoomExists(roomCode));

    // Create the room item using the generated room code for both id and roomCode
    const roomItem = {
      roomId: roomCode,
      id: roomCode,
      hostId: hostId,
      hostUsername: hostUsername,
      maxUsers,
      genreFilter,
      streamingService,
      members: [[hostId, hostUsername]], // Add the host as a member tuple
      roomCode: roomCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Write the room item to DynamoDB
    await dynamo.put({ TableName: TABLE_NAME, Item: roomItem }).promise();

    // Return the created room object to the GraphQL client
    return roomItem;
  } catch (error) {
    console.error("Lambda error:", error);
    // When using GraphQL, throwing an error is enough to signal a failure.
    throw new Error(error.message);
  }
};
