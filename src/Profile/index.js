import React from 'react';
import { Query } from 'react-apollo';

import { GET_REPOSITORIES_OF_CURRENT_USER } from './queries';
import RepositoryList from '../Repository';

import Loading from '../Loading';
import Error from '../Error';

const Profile = () => (
  <Query
    query={GET_REPOSITORIES_OF_CURRENT_USER}
    variables={{
      cursor: null,
    }}
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      const { viewer } = data;

      if (loading && !viewer) {
        return <Loading isCenter={true} />;
      }

      if (error) {
        return <Error error={error} />;
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
