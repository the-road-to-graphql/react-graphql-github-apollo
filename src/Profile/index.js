import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../Loading';
import Repositories from '../Repositories';
import REPOSITORY_FRAGMENT from '../Repositories/fragments';

const Profile = ({
  data: {
    loading,
    error,
    viewer,
    fetchMore,
  }
}) => {
  if (loading && !viewer) {
    return <Loading />;
  }

  if (error) {
    return (
      <div>
        <p><strong>Something went wrong:</strong> {error.toString()}</p>
      </div>
    );
  }

  return (
    <div>
      <Repositories
        loading={loading}
        entry={'viewer'}
        repositories={viewer.repositories}
        fetchMore={fetchMore}
      />
    </div>
  );
}

const REPOSITORIES_OF_CURRENT_USER = gql`
  query ($cursor: String) {
    viewer {
      login
      name
      avatarUrl
      repositories(first: 5, orderBy: {direction: DESC, field: STARGAZERS}, after: $cursor) {
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
`

const REPOSITORIES_OF_CURRENT_USER_CONFIG = {
  options: ({ organization }) => ({
    variables: {
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  }),
};

export default graphql(
  REPOSITORIES_OF_CURRENT_USER,
  REPOSITORIES_OF_CURRENT_USER_CONFIG
)(Profile);
