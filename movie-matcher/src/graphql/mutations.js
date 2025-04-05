/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
export const createMember = /* GraphQL */ `
  mutation CreateMember(
    $input: CreateMemberInput!
    $condition: ModelMemberConditionInput
  ) {
    createMember(input: $input, condition: $condition) {
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
export const updateMember = /* GraphQL */ `
  mutation UpdateMember(
    $input: UpdateMemberInput!
    $condition: ModelMemberConditionInput
  ) {
    updateMember(input: $input, condition: $condition) {
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
export const deleteMember = /* GraphQL */ `
  mutation DeleteMember(
    $input: DeleteMemberInput!
    $condition: ModelMemberConditionInput
  ) {
    deleteMember(input: $input, condition: $condition) {
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
export const createVote = /* GraphQL */ `
  mutation CreateVote(
    $input: CreateVoteInput!
    $condition: ModelVoteConditionInput
  ) {
    createVote(input: $input, condition: $condition) {
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
export const updateVote = /* GraphQL */ `
  mutation UpdateVote(
    $input: UpdateVoteInput!
    $condition: ModelVoteConditionInput
  ) {
    updateVote(input: $input, condition: $condition) {
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
export const deleteVote = /* GraphQL */ `
  mutation DeleteVote(
    $input: DeleteVoteInput!
    $condition: ModelVoteConditionInput
  ) {
    deleteVote(input: $input, condition: $condition) {
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
