/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePoll = /* GraphQL */ `
  subscription OnCreatePoll($filter: ModelSubscriptionPollFilterInput) {
    onCreatePoll(filter: $filter) {
      id
      creatorId
      createdAt
      options {
        items {
          pollId
          text
          numVotes
          tinyUrl
          longUrl
          voters
          id
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      description
      updatedAt
      __typename
    }
  }
`;
export const onUpdatePoll = /* GraphQL */ `
  subscription OnUpdatePoll($filter: ModelSubscriptionPollFilterInput) {
    onUpdatePoll(filter: $filter) {
      id
      creatorId
      createdAt
      options {
        items {
          pollId
          text
          numVotes
          tinyUrl
          longUrl
          voters
          id
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      description
      updatedAt
      __typename
    }
  }
`;
export const onDeletePoll = /* GraphQL */ `
  subscription OnDeletePoll($filter: ModelSubscriptionPollFilterInput) {
    onDeletePoll(filter: $filter) {
      id
      creatorId
      createdAt
      options {
        items {
          pollId
          text
          numVotes
          tinyUrl
          longUrl
          voters
          id
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      description
      updatedAt
      __typename
    }
  }
`;
export const onCreateOption = /* GraphQL */ `
  subscription OnCreateOption($filter: ModelSubscriptionOptionFilterInput) {
    onCreateOption(filter: $filter) {
      pollId
      text
      numVotes
      tinyUrl
      longUrl
      voters
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateOption = /* GraphQL */ `
  subscription OnUpdateOption($filter: ModelSubscriptionOptionFilterInput) {
    onUpdateOption(filter: $filter) {
      pollId
      text
      numVotes
      tinyUrl
      longUrl
      voters
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteOption = /* GraphQL */ `
  subscription OnDeleteOption($filter: ModelSubscriptionOptionFilterInput) {
    onDeleteOption(filter: $filter) {
      pollId
      text
      numVotes
      tinyUrl
      longUrl
      voters
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      userId
      username
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      userId
      username
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      userId
      username
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
