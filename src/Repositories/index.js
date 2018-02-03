import React from 'react';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import {
  WATCH_REPOSITORY,
  STAR_REPOSITORY,
  UNSTAR_REPOSITORY,
} from './mutations';

import Issues from '../Issues';
import Loading from '../Loading';

import './style.css';

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
};

const doFetchMore = (fetchMore, entry, cursor) => fetchMore({
  // query: ... (you can specify a different query, otherwise your previous quert is used)
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
        }
      }
    }
  },
});

const Repositories = ({
  loading,
  repositories,
  entry,
  fetchMore,
  onWatchToggle,
  onStarAdd,
  onStarRemove,
}) =>
  <div>
    <div>
      {repositories.edges.map(repository =>
        <div key={repository.node.id}>
          <Repository
            { ...repository.node }
            onWatchToggle={onWatchToggle}
            onStarAdd={onStarAdd}
            onStarRemove={onStarRemove}
          />
          <Issues
            repositoryName={repository.node.name}
            repositoryOwner={repository.node.owner.login}
          />
          <hr />
        </div>
      )}
    </div>

    <FetchMoreButton
      loading={loading}
      pageInfo={repositories.pageInfo}
      entry={entry}
      fetchMore={fetchMore}
    />
  </div>

const Repository = ({
  id,
  name,
  url,
  description,
  stargazers,
  forks,
  watchers,
  viewerSubscription,
  viewerHasStarred,
  onWatchToggle,
  onStarAdd,
  onStarRemove,
}) =>
  <div className="Repository">
    <h2><a href={url}>{name}</a></h2>

    <p>{description}</p>

    <div className="Repository-details">
      {viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED
        ? (
            <button
              onClick={() => onWatchToggle(id, VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED)}
              type="button"
            >
              {watchers.totalCount} Unwatch
            </button>
        ) : (
          <button
            onClick={() => onWatchToggle(id, VIEWER_SUBSCRIPTIONS.SUBSCRIBED)}
            type="button"
          >
            {watchers.totalCount} Watch
          </button>
        )
      }

      {viewerHasStarred
        ? (
            <button
              onClick={() => onStarRemove(id, !viewerHasStarred)}
              type="button"
            >
              {stargazers.totalCount} Unstar
            </button>
        ) : (
          <button
            onClick={() => onStarAdd(id, !viewerHasStarred)}
            type="button"
          >
            {stargazers.totalCount} Star
          </button>
        )
      }

      <p>Forks: {forks.totalCount}</p>
    </div>
  </div>

const FetchMoreButton = ({
  loading,
  pageInfo,
  entry,
  fetchMore,
}) =>
  <div>
    {
      loading ? (
        <Loading />
      ) : (
        <button
          onClick={() => doFetchMore(fetchMore, entry, pageInfo.endCursor)}
          type="button"
          disabled={!pageInfo.hasNextPage}
        >
          More
        </button>
      )
    }
  </div>

export default compose(
  graphql(
    WATCH_REPOSITORY.WATCH_REPOSITORY_MUTATION,
    WATCH_REPOSITORY.WATCH_REPOSITORY_CONFIG
  ),
  graphql(
    STAR_REPOSITORY.STAR_REPOSITORY_MUTATION,
    STAR_REPOSITORY.STAR_REPOSITORY_CONFIG
  ),
  graphql(
    UNSTAR_REPOSITORY.UNSTAR_REPOSITORY_MUTATION,
    UNSTAR_REPOSITORY.UNSTAR_REPOSITORY_CONFIG
  ),
)(Repositories);
