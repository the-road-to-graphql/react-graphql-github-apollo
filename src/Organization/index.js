import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Repositories, { REPOSITORY_FRAGMENT } from '../Repositories';
import Loading from '../Loading';

const Organization = ({
  data: {
    loading,
    error,
    organization,
    fetchMore,
  }
}) => {
  if (loading && !organization) {
    return (
      <div>
        <Loading />
      </div>
    );
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
      PLACEHOLDER: Some Orgabnization Info

      <Repositories
        loading={loading}
        repositories={organization.repositories}
        fetchMore={fetchMore}
      />
    </div>
  );
}

const REPOSITORIES_OF_ORGANIZATION = gql`
  query ($organization: String!, $cursor: String) {
    organization(login: $organization) {
      name
      login
      url
      repositories(first: 5, after: $cursor) {
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

const REPOSITORIES_OF_ORGANIZATION_CONFIG = {
  options: ({ organization }) => ({
    variables: {
      organization,
      cursor: null,
    },
    skip: organization === '',
    notifyOnNetworkStatusChange: true,
  }),
};

export default graphql(
  REPOSITORIES_OF_ORGANIZATION,
  REPOSITORIES_OF_ORGANIZATION_CONFIG
)(Organization);