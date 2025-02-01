const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "RoomsTable-dev";

exports.handler = async (event) => {
  console.log("🚀 FULL EVENT DATA:", JSON.stringify(event, null, 2));

  try {
    // ✅ Extract `roomId` and `username`
    let roomId, username;

    // Extract roomId from query parameters or from an "application/json" property
    if (event.queryStringParameters?.roomId) {
      roomId = event.queryStringParameters.roomId;
    } else if (event["application/json"]?.queryStringParameters?.roomId) {
      roomId = event["application/json"].queryStringParameters.roomId;
    }

    // Extract username similarly
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
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Room not found" }),
      };
    }

    console.log("✅ Room found:", JSON.stringify(result.Item, null, 2));

    // ✅ Check if the user is already in the room.
    // Regardless of host or not, if the username exists in members, don't add them again.
    if (result.Item.members && result.Item.members.includes(username)) {
      console.log("⚠️ User already in the room:", username);
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ message: "User already in the room", roomData: result.Item }),
      };
    }

    // ✅ Add the username to the members list.
    // Use if_not_exists to ensure the members attribute exists (or default it to an empty array).
    const updateParams = {
      TableName: TABLE_NAME,
      Key: { roomId },
      UpdateExpression: "SET members = list_append(if_not_exists(members, :empty), :newUser)",
      ExpressionAttributeValues: {
        ":empty": [],
        ":newUser": [username],
      },
      ReturnValues: "ALL_NEW",
    };

    const updateResult = await dynamo.update(updateParams).promise();
    console.log("✅ User added to room:", updateResult);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "User added successfully",
        roomData: updateResult.Attributes,
      }),
    };
  } catch (error) {
    console.error("❌ Lambda Error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
    };
  }
};