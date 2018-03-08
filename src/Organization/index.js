import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../Loading';
import ErrorMessage from '../Error';
import Repositories from '../Repositories';
import REPOSITORY_FRAGMENT from '../Repositories/fragments';

const Organization = ({
  data: { loading, error, organization, fetchMore },
}) => {
  if (loading && !organization) {
    return <Loading isCenter={true} />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div>
      <Repositories
        loading={loading}
        repositories={organization.repositories}
        fetchMore={fetchMore}
        entry={'organization'}
      />
    </div>
  );
};

const REPOSITORIES_OF_ORGANIZATION = gql`
  query($organization: String!, $cursor: String) {
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
`;

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
  REPOSITORIES_OF_ORGANIZATION_CONFIG,
)(Organization);
