import React from 'react';

import RepositoryItem from '../RepositoryItem';
import Issues from '../../Issues';
import FetchMore from '../../FetchMore';

import '../style.css';

const doFetchMore = fetchMore => (cursor, { entry }) =>
  fetchMore({
    variables: {
      cursor,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult) {
        return previousResult;
      }

      return {
        ...previousResult,
        [entry]: {
          ...previousResult[entry],
          repositories: {
            ...previousResult[entry].repositories,
            ...fetchMoreResult[entry].repositories,
            edges: [
              ...previousResult[entry].repositories.edges,
              ...fetchMoreResult[entry].repositories.edges,
            ],
          },
        },
      };
    },
  });

const RepositoryList = ({ loading, repositories, entry, fetchMore }) => (
  <div>
    {repositories.edges.map(repository => (
      <div key={repository.node.id} className="Repository">
        <RepositoryItem {...repository.node} />

        <Issues
          repositoryName={repository.node.name}
          repositoryOwner={repository.node.owner.login}
        />
      </div>
    ))}

    <FetchMore
      payload={{ entry }}
      loading={loading}
      pageInfo={repositories.pageInfo}
      doFetchMore={doFetchMore(fetchMore)}
    >
      Repositories
    </FetchMore>
  </div>
);

export default RepositoryList;
