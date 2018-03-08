import React from 'react';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import {
  WATCH_REPOSITORY,
  STAR_REPOSITORY,
  UNSTAR_REPOSITORY,
} from './mutations';

import Issues from '../Issues';
import Button from '../Button';
import FetchMore from '../FetchMore';
import Link from '../Link';

import './style.css';

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
};

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

const Repositories = ({
  loading,
  repositories,
  entry,
  fetchMore,
  onWatchToggle,
  onStarAdd,
  onStarRemove,
}) => (
  <div>
    {repositories.edges.map(repository => (
      <div key={repository.node.id} className="Repository">
        <Repository
          {...repository.node}
          onWatchToggle={onWatchToggle}
          onStarAdd={onStarAdd}
          onStarRemove={onStarRemove}
        />
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

const Repository = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred,
  onWatchToggle,
  onStarAdd,
  onStarRemove,
}) => (
  <div>
    <div className="Repository-title">
      <h2>
        <Link href={url}>{name}</Link>
      </h2>

      <div>
        {viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED ? (
          <Button
            className={'Repository-title-action'}
            onClick={() => onWatchToggle(id, VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED)}
          >
            {watchers.totalCount} Unwatch
          </Button>
        ) : (
          <Button
            className={'Repository-title-action'}
            onClick={() => onWatchToggle(id, VIEWER_SUBSCRIPTIONS.SUBSCRIBED)}
          >
            {watchers.totalCount} Watch
          </Button>
        )}

        {viewerHasStarred ? (
          <Button
            className={'Repository-title-action'}
            onClick={() => onStarRemove(id, !viewerHasStarred)}
          >
            {stargazers.totalCount} Unstar
          </Button>
        ) : (
          <Button
            className={'Repository-title-action'}
            onClick={() => onStarAdd(id, !viewerHasStarred)}
          >
            {stargazers.totalCount} Star
          </Button>
        )}
      </div>
    </div>

    <div className="Repository-description">
      <div
        className="Repository-description-info"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />
      <div className="Repository-description-details">
        <div>
          {primaryLanguage && <span>Language: {primaryLanguage.name}</span>}
        </div>
        <div>
          {owner && (
            <span>
              Owner: <a href={owner.url}>{owner.login}</a>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default compose(
  graphql(
    WATCH_REPOSITORY.WATCH_REPOSITORY_MUTATION,
    WATCH_REPOSITORY.WATCH_REPOSITORY_CONFIG,
  ),
  graphql(
    STAR_REPOSITORY.STAR_REPOSITORY_MUTATION,
    STAR_REPOSITORY.STAR_REPOSITORY_CONFIG,
  ),
  graphql(
    UNSTAR_REPOSITORY.UNSTAR_REPOSITORY_MUTATION,
    UNSTAR_REPOSITORY.UNSTAR_REPOSITORY_CONFIG,
  ),
)(Repositories);
