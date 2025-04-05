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
      members {
        nextToken
        __typename
      }
      selectionStarted
      roomCode
      likedMovies
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
      members {
        nextToken
        __typename
      }
      selectionStarted
      roomCode
      likedMovies
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
      members {
        nextToken
        __typename
      }
      selectionStarted
      roomCode
      likedMovies
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreateMember = /* GraphQL */ `
  subscription OnCreateMember(
    $filter: ModelSubscriptionMemberFilterInput
    $owner: String
  ) {
    onCreateMember(filter: $filter, owner: $owner) {
      id
      roomId
      userId
      username
      joinedAt
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateMember = /* GraphQL */ `
  subscription OnUpdateMember(
    $filter: ModelSubscriptionMemberFilterInput
    $owner: String
  ) {
    onUpdateMember(filter: $filter, owner: $owner) {
      id
      roomId
      userId
      username
      joinedAt
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteMember = /* GraphQL */ `
  subscription OnDeleteMember(
    $filter: ModelSubscriptionMemberFilterInput
    $owner: String
  ) {
    onDeleteMember(filter: $filter, owner: $owner) {
      id
      roomId
      userId
      username
      joinedAt
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreateVote = /* GraphQL */ `
  subscription OnCreateVote($filter: ModelSubscriptionVoteFilterInput) {
    onCreateVote(filter: $filter) {
      id
      movieId
      roomId
      userId
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateVote = /* GraphQL */ `
  subscription OnUpdateVote($filter: ModelSubscriptionVoteFilterInput) {
    onUpdateVote(filter: $filter) {
      id
      movieId
      roomId
      userId
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteVote = /* GraphQL */ `
  subscription OnDeleteVote($filter: ModelSubscriptionVoteFilterInput) {
    onDeleteVote(filter: $filter) {
      id
      movieId
      roomId
      userId
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
