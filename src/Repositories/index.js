import React from 'react';
import { Mutation } from 'react-apollo';

import {
  STAR_REPOSITORY,
  UNSTAR_REPOSITORY,
  WATCH_REPOSITORY,
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

const Repositories = ({ loading, repositories, entry, fetchMore }) => (
  <div>
    {repositories.edges.map(repository => (
      <div key={repository.node.id} className="Repository">
        <Repository {...repository.node} />

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

const updateAddStar = (
  client,
  { data: { addStar: { starrable: { id, viewerHasStarred } } } },
) =>
  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: getUpdatedStarData(client, id, viewerHasStarred),
  });

const updateRemoveStar = (
  client,
  { data: { removeStar: { starrable: { id, viewerHasStarred } } } },
) => {
  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: getUpdatedStarData(client, id, viewerHasStarred),
  });
};

const getUpdatedStarData = (client, id, viewerHasStarred) => {
  const fragment = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  let { totalCount } = fragment.stargazers;
  totalCount = viewerHasStarred ? totalCount + 1 : totalCount - 1;

  return {
    ...fragment,
    stargazers: {
      ...fragment.stargazers,
      totalCount,
    },
  };
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
}) => (
  <div>
    <div className="Repository-title">
      <h2>
        <Link href={url}>{name}</Link>
      </h2>

      <div>
        <Mutation
          mutation={WATCH_REPOSITORY}
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
          <Mutation
            mutation={UNSTAR_REPOSITORY}
            variables={{ id }}
            optimisticResponse={{
              removeStar: {
                __typename: 'Mutation',
                starrable: {
                  __typename: 'Repository',
                  id,
                  viewerHasStarred: !viewerHasStarred,
                },
              },
            }}
            update={updateRemoveStar}
          >
            {(removeStar, { data, loading, error }) => (
              <Button
                className={'Repository-title-action'}
                onClick={removeStar}
              >
                {stargazers.totalCount} Unstar
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation
            mutation={STAR_REPOSITORY}
            variables={{ id }}
            optimisticResponse={{
              addStar: {
                __typename: 'Mutation',
                starrable: {
                  __typename: 'Repository',
                  id,
                  viewerHasStarred: !viewerHasStarred,
                },
              },
            }}
            update={updateAddStar}
          >
            {(addStar, { data, loading, error }) => (
              <Button className={'Repository-title-action'} onClick={addStar}>
                {stargazers.totalCount} Star
              </Button>
            )}
          </Mutation>
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

export default Repositories;
