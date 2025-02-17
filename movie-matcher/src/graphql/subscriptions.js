/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRoom = /* GraphQL */ `
  subscription OnCreateRoom(
    $filter: ModelSubscriptionRoomFilterInput
    $owner: String
  ) {
    onCreateRoom(filter: $filter, owner: $owner) {
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
export const onUpdateRoom = /* GraphQL */ `
  subscription OnUpdateRoom(
    $filter: ModelSubscriptionRoomFilterInput
    $owner: String
  ) {
    onUpdateRoom(filter: $filter, owner: $owner) {
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
export const onDeleteRoom = /* GraphQL */ `
  subscription OnDeleteRoom(
    $filter: ModelSubscriptionRoomFilterInput
    $owner: String
  ) {
    onDeleteRoom(filter: $filter, owner: $owner) {
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
