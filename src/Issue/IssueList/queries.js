import gql from 'graphql-tag';

export const GET_ISSUES_OF_REPOSITORY = gql`
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $issueState: IssueState!
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5, states: [$issueState], after: $cursor) {
        edges {
          node {
            id
            number
            state
            title
            url
            bodyHTML
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;
