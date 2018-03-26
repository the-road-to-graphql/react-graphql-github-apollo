import React, { Fragment } from 'react';

import RepositoryItem from '../RepositoryItem';

import IssueList from '../../Issue/IssueList';
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

const RepositoryList = ({ entry, repositories, loading, fetchMore }) => (
  <Fragment>
    {repositories.edges.map(({ node }) => (
      <div key={node.id} className="Repository">
        <RepositoryItem {...node} />

        <IssueList
          repositoryName={node.name}
          repositoryOwner={node.owner.login}
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
  </Fragment>
);

export default RepositoryList;
