import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../Loading';
import ErrorMessage from '../Error';
import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';

const Organization = ({ organizationName }) => (
  <Query
    query={REPOSITORIES_OF_ORGANIZATION}
    variables={{
      organizationName: organizationName,
      cursor: null,
    }}
    skip={organizationName === ''}
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      const { organization } = data;

      if (loading && !organization) {
        return <Loading isCenter={true} />;
      }

      if (error) {
        return <ErrorMessage error={error} />;
      }

      return (
        <div>
          <RepositoryList
            loading={loading}
            repositories={organization.repositories}
            fetchMore={fetchMore}
            entry={'organization'}
          />
        </div>
      );
    }}
  </Query>
);

const REPOSITORIES_OF_ORGANIZATION = gql`
  query($organizationName: String!, $cursor: String) {
    organization(login: $organizationName) {
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

export default Organization;
