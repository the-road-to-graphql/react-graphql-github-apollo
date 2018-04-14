import React from 'react';
import { Query } from 'react-apollo';

import { GET_REPOSITORIES_OF_ORGANIZATION } from './queries';
import RepositoryList from '../Repository';

import LoadingIndicator from '../Loading';
import ErrorMessage from '../Error';

const Organization = ({ organizationName }) => (
  <Query
    query={GET_REPOSITORIES_OF_ORGANIZATION}
    variables={{
      organizationName,
      cursor: null,
    }}
    skip={organizationName === ''}
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      const { organization } = data;

      if (loading && !organization) {
        return <LoadingIndicator isCenter={true} />;
      }

      if (error) {
        return <ErrorMessage error={error} />;
      }

      return (
        <RepositoryList
          loading={loading}
          repositories={organization.repositories}
          fetchMore={fetchMore}
          entry={'organization'}
        />
      );
    }}
  </Query>
);

export default Organization;
