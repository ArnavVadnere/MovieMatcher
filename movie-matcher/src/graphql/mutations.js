/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const customCreateRoom = /* GraphQL */ `
  mutation CustomCreateRoom($input: CustomCreateRoomInput!) {
    customCreateRoom(input: $input) {
      id
      hostId
      hostUsername
      maxUsers
      genreFilter
      streamingService
      members
      roomCode
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const joinRoom = /* GraphQL */ `
  mutation JoinRoom($input: JoinRoomInput!) {
    joinRoom(input: $input) {
      id
      hostId
      hostUsername
      maxUsers
      genreFilter
      streamingService
      members
      roomCode
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createRoom = /* GraphQL */ `
  mutation CreateRoom(
    $input: CreateRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    createRoom(input: $input, condition: $condition) {
      id
      hostId
      hostUsername
      maxUsers
      genreFilter
      streamingService
      members
      roomCode
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateRoom = /* GraphQL */ `
  mutation UpdateRoom(
    $input: UpdateRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    updateRoom(input: $input, condition: $condition) {
      id
      hostId
      hostUsername
      maxUsers
      genreFilter
      streamingService
      members
      roomCode
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteRoom = /* GraphQL */ `
  mutation DeleteRoom(
    $input: DeleteRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    deleteRoom(input: $input, condition: $condition) {
      id
      hostId
      hostUsername
      maxUsers
      genreFilter
      streamingService
      members
      roomCode
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
