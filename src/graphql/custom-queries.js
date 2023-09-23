
export const pollsByDateWithOptions = /* GraphQL */ `
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
      nextToken
      __typename
    }
  }
`;