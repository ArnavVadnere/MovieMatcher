const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

// const TABLE_NAME = process.env.STORAGE_MOVIEMATCHERROOMSTABLE_NAME;
const TABLE_NAME = "RoomsTable-dev";

const generateShortRoomId = () => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

const checkRoomExists = async (roomId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { roomId },
  };
  const result = await dynamo.get(params).promise();
  return result.Item !== undefined;
};

exports.handler = async (event) => {
  try {
    const { username, userId, maxUsers, genreFilter, streamingService } = JSON.parse(event.body);
    const members = []; // Initialize members as an empty array
    if (!userId || !maxUsers) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    let roomId;
    do {
      roomId = generateShortRoomId();
    } while (await checkRoomExists(roomId));

    const params = {
      TableName: TABLE_NAME,
      Item: {
        roomId,
        hostId: {
          userId,    // the unique identifier
          username,  // the user's name
        },
        maxUsers,
        genreFilter,
        streamingService,
        members,
        createdAt: new Date().toISOString(),
      },
    };

    await dynamo.put(params).promise();
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ roomId }),
    };
  } catch (error) {
    console.error("Lambda error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
