import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import { GET_REPOSITORIES_OF_CURRENT_USER } from './queries';
import RepositoryList from '../Repository';
import Loading from '../Loading';
// import ErrorMessage from '../Error';

export const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  {
    viewer {
      login
      name
      repositories(
        first: 5
        orderBy: { direction: DESC, field: STARGAZERS }
      ) {
        edges {
          node {
            id
            name
            url
            descriptionHTML
            primaryLanguage {
              name
            }
            owner {
              login
              url
            }
            stargazers {
              totalCount
            }
            viewerHasStarred
            watchers {
              totalCount
            }
            viewerSubscription
          }
        }
      }
    }
  }
`;

const Profile = () => (
  <Query query={GET_REPOSITORIES_OF_CURRENT_USER}>
    {({ data, loading }) => {
      const { viewer } = data;

      if (loading || !viewer) {
        return <Loading isCenter={true} />;
      }

      return <RepositoryList repositories={viewer.repositories} />;
    }}
  </Query>
);

export default Profile;
