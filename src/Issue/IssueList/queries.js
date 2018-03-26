import gql from 'graphql-tag';

export const ISSUES_OF_REPOSITORY = gql`
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $kindOfIssue: IssueState!
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5, states: [$kindOfIssue], after: $cursor) {
        edges {
          node {
            id
            number
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
