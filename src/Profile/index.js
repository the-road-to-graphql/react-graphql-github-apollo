import React from 'react';
import { Query } from 'react-apollo';

import { REPOSITORIES_OF_CURRENT_USER } from './queries';
import RepositoryList from '../Repository';

import LoadingIndicator from '../Loading';
import ErrorMessage from '../Error';

const Profile = () => (
  <Query
    query={REPOSITORIES_OF_CURRENT_USER}
    variables={{
      cursor: null,
    }}
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      const { viewer } = data;

      if (loading && !viewer) {
        return <LoadingIndicator isCenter={true} />;
      }

      if (error) {
        return <ErrorMessage error={error} />;
      }

      return (
        <RepositoryList
          loading={loading}
          repositories={viewer.repositories}
          fetchMore={fetchMore}
          entry={'viewer'}
        />
      );
    }}
  </Query>
);

export default Profile;
