const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "RoomsTable-dev";

exports.handler = async (event) => {
  console.log("🚀 FULL EVENT DATA:", JSON.stringify(event, null, 2));

  try {
    // ✅ Extract `roomId` and `username`
    let roomId, username;

    // Extract roomId
    if (event.queryStringParameters?.roomId) {
      roomId = event.queryStringParameters.roomId;
    } else if (event["application/json"]?.queryStringParameters?.roomId) {
      roomId = event["application/json"].queryStringParameters.roomId;
    }

    // Extract username
    if (event.queryStringParameters?.username) {
      username = event.queryStringParameters.username;
    } else if (event["application/json"]?.queryStringParameters?.username) {
      username = event["application/json"].queryStringParameters.username;
    }

    if (!roomId || !username) {
      console.error("❌ Missing roomId or username");
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing roomId or username" }),
      };
    }

    // ✅ Fetch room details from DynamoDB
    const params = {
      TableName: TABLE_NAME,
      Key: { roomId },
    };

    console.log("🔍 Fetching room data for:", roomId);
    const result = await dynamo.get(params).promise();

    if (!result.Item) {
      console.warn("⚠️ Room not found:", roomId);
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Room not found" }),
      };
    }

    console.log("✅ Room found:", JSON.stringify(result.Item, null, 2));

    // ✅ Check if the user is already in the room.
    // Since the host should only appear once in the members array, this check will catch both host and non-host duplicates.
    if (
      result.Item.hostId.username === username ||
      result.Item.members.includes(username)
    ) {
      console.log("⚠️ User already in the room:", username);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "User already in the room",
          roomData: result.Item,
        }),
      };
    }

    // ✅ Add the username to the members list
    const updateParams = {
      TableName: TABLE_NAME,
      Key: { roomId },
      UpdateExpression: "SET members = list_append(members, :newUser)",
      ExpressionAttributeValues: {
        ":newUser": [username],
      },
      ReturnValues: "UPDATED_NEW",
    };

    const updateResult = await dynamo.update(updateParams).promise();
    console.log("✅ User added to room:", updateResult);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "User added successfully",
        roomData: updateResult.Attributes,
      }),
    };
  } catch (error) {
    console.error("❌ Lambda Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
    };
  }
};
