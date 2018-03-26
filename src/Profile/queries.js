import gql from 'graphql-tag';

import { REPOSITORY_FRAGMENT } from '../Repository';

export const REPOSITORIES_OF_CURRENT_USER = gql`
  query($cursor: String) {
    viewer {
      login
      name
      avatarUrl
      repositories(
        first: 5
        orderBy: { direction: DESC, field: STARGAZERS }
        after: $cursor
      ) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }

  ${REPOSITORY_FRAGMENT}
`;
