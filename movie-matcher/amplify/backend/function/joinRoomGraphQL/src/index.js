const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME =
  process.env.STORAGE_MOVIEMATCHERROOMSTABLE_NAME || "RoomsTable-dev";

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    const { roomId, username } = event.arguments.input;
    if (!roomId || !username) {
      throw new Error("Missing required fields: roomId or username");
    }

    // Retrieve the room item from DynamoDB
    const getParams = {
      TableName: TABLE_NAME,
      Key: { roomId: roomId },
    };

    const getResult = await dynamo.get(getParams).promise();
    if (!getResult.Item) {
      throw new Error(`Room with id ${roomId} not found.`);
    }

    let roomItem = getResult.Item;

    // Initialize members array if it doesn't exist
    let members = roomItem.members || [];

    // Add the userId and username tuple if not already in the list
    const userId = event.arguments.input.userId;
    const userTuple = { userId, username };

    if (!members.some((member) => member.userId === userId)) {
      members.push(userTuple);
    } else {
      console.log(`${username} is already a member.`);
    }

    // Update the room item
    const updatedRoomItem = {
      ...roomItem,
      members: members,
      updatedAt: new Date().toISOString(), // update timestamp
    };

    // Save the updated item back to DynamoDB
    const putParams = {
      TableName: TABLE_NAME,
      Item: updatedRoomItem,
    };

    await dynamo.put(putParams).promise();

    return updatedRoomItem;
  } catch (error) {
    console.error("Error in joinRoom function:", error);
    throw new Error(error.message);
  }
};
