/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPoll = /* GraphQL */ `
  query GetPoll($id: ID!) {
    getPoll(id: $id) {
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
export const listPolls = /* GraphQL */ `
  query ListPolls(
    $filter: ModelPollFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPolls(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        creatorId
        createdAt
        options {
          nextToken
          __typename
        }
        description
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getOption = /* GraphQL */ `
  query GetOption($id: ID!) {
    getOption(id: $id) {
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
export const listOptions = /* GraphQL */ `
  query ListOptions(
    $filter: ModelOptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOptions(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      userId
      username
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        userId
        username
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const pollsByDate = /* GraphQL */ `
  query PollsByDate(
    $creatorId: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPollFilterInput
    $limit: Int
    $nextToken: String
  ) {
    pollsByDate(
      creatorId: $creatorId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        creatorId
        createdAt
        options {
          nextToken
          __typename
        }
        description
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const optionsByPollIdAndNumVotes = /* GraphQL */ `
  query OptionsByPollIdAndNumVotes(
    $pollId: ID!
    $numVotes: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    optionsByPollIdAndNumVotes(
      pollId: $pollId
      numVotes: $numVotes
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
  }
`;
