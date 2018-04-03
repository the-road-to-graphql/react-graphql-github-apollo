import React, { Fragment } from 'react';
import { lensPath, set, view, compose } from 'ramda';

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

      const repositoriesLens = lensPath([entry, 'repositories']);
      const edgesLens = lensPath([entry, 'repositories', 'edges']);

      const updatedRepositoryEdges = [
        ...view(edgesLens, previousResult),
        ...view(edgesLens, fetchMoreResult),
      ];

      return compose(
        set(edgesLens, updatedRepositoryEdges),
        set(repositoriesLens, view(repositoriesLens, fetchMoreResult)),
      )(previousResult);
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
