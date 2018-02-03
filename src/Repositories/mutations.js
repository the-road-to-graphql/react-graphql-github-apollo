import gql from 'graphql-tag';

import REPOSITORY_FRAGMENT from './fragments';

const WATCH_REPOSITORY_MUTATION = gql`
  mutation ($id: ID!, $isWatch: SubscriptionState!) {
    updateSubscription(input:{state: $isWatch, subscribableId: $id}) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`

const WATCH_REPOSITORY_CONFIG = {
  name: 'watchRepository',
  props: ({ watchRepository }) => ({
    onWatchToggle(id, isWatch) {
      watchRepository({
        variables: { id, isWatch },
        optimisticResponse: {
          updateSubscription: {
            __typename: 'Mutation',
            subscribable: {
              __typename: 'Repository',
              id,
              viewerSubscription: isWatch,
            }
          }
        },
      })
    },
  }),
  options: {
    update: (proxy, props) => {
      const { id, viewerSubscription } = props.data.updateSubscription.subscribable;

      const fragment = proxy.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
      });

      let { totalCount } = fragment.watchers;
      totalCount = viewerSubscription === 'SUBSCRIBED'
        ? totalCount + 1
        : totalCount - 1;

      proxy.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: {
          ...fragment,
          watchers: {
            ...fragment.watchers,
            totalCount,
          }
        },
      });
    },
  }
};

const WATCH_REPOSITORY = {
  WATCH_REPOSITORY_MUTATION,
  WATCH_REPOSITORY_CONFIG,
};

export {
  WATCH_REPOSITORY,
};