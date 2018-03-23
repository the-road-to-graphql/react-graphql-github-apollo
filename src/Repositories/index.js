import React from 'react';
import { graphql, Mutation } from 'react-apollo';
import { compose } from 'recompose';

import {
  STAR_REPOSITORY,
  UNSTAR_REPOSITORY,
  WATCH_REPOSITORY_MUTATION,
} from './mutations';

import REPOSITORY_FRAGMENT from './fragments';

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
  onStarAdd,
  onStarRemove,
}) => (
  <div>
    {repositories.edges.map(repository => (
      <div key={repository.node.id} className="Repository">
        <Repository
          {...repository.node}
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

const isWatch = viewerSubscription =>
  viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

const updateWatch = (
  client,
  {
    data: { updateSubscription: { subscribable: { id, viewerSubscription } } },
  },
) => {
  const fragment = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  let { totalCount } = fragment.watchers;
  totalCount =
    viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED
      ? totalCount + 1
      : totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...fragment,
      watchers: {
        ...fragment.watchers,
        totalCount,
      },
    },
  });
};

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
  onStarAdd,
  onStarRemove,
}) => (
  <div>
    <div className="Repository-title">
      <h2>
        <Link href={url}>{name}</Link>
      </h2>

      <div>
        <Mutation
          mutation={WATCH_REPOSITORY_MUTATION}
          variables={{
            id,
            viewerSubscription: isWatch(viewerSubscription)
              ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
              : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
          }}
          optimisticResponse={{
            updateSubscription: {
              __typename: 'Mutation',
              subscribable: {
                __typename: 'Repository',
                id,
                viewerSubscription: isWatch(viewerSubscription)
                  ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                  : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
              },
            },
          }}
          update={updateWatch}
        >
          {(updateSubscription, { data, loading, error }) => (
            <Button
              className={'Repository-title-action'}
              onClick={updateSubscription}
            >
              {watchers.totalCount}{' '}
              {isWatch(viewerSubscription) ? 'Unwatch' : 'Watch'}
            </Button>
          )}
        </Mutation>

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
    STAR_REPOSITORY.STAR_REPOSITORY_MUTATION,
    STAR_REPOSITORY.STAR_REPOSITORY_CONFIG,
  ),
  graphql(
    UNSTAR_REPOSITORY.UNSTAR_REPOSITORY_MUTATION,
    UNSTAR_REPOSITORY.UNSTAR_REPOSITORY_CONFIG,
  ),
)(Repositories);
