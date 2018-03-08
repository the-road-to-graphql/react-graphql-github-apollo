import gql from 'graphql-tag';

import REPOSITORY_FRAGMENT from './fragments';

const STAR_REPOSITORY_MUTATION = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const STAR_REPOSITORY_CONFIG = {
  name: 'starRepository',
  props: ({ starRepository }) => ({
    onStarAdd(id, isStar) {
      starRepository({
        variables: { id },
        optimisticResponse: {
          addStar: {
            __typename: 'Mutation',
            starrable: {
              __typename: 'Repository',
              id,
              viewerHasStarred: isStar,
            },
          },
        },
      });
    },
  }),
  options: {
    update: (proxy, props) => {
      const { id, viewerHasStarred } = props.data.addStar.starrable;

      const updatedData = getUpdatedData(proxy, id, viewerHasStarred);

      proxy.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: updatedData,
      });
    },
  },
};

const UNSTAR_REPOSITORY_MUTATION = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const UNSTAR_REPOSITORY_CONFIG = {
  name: 'unstarRepository',
  props: ({ unstarRepository }) => ({
    onStarRemove(id, isStar) {
      unstarRepository({
        variables: { id },
        optimisticResponse: {
          removeStar: {
            __typename: 'Mutation',
            starrable: {
              __typename: 'Repository',
              id,
              viewerHasStarred: isStar,
            },
          },
        },
      });
    },
  }),
  options: {
    update: (proxy, props) => {
      const { id, viewerHasStarred } = props.data.removeStar.starrable;

      const updatedData = getUpdatedData(proxy, id, viewerHasStarred);

      proxy.writeFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
        data: updatedData,
      });
    },
  },
};

const getUpdatedData = (proxy, id, viewerHasStarred) => {
  const fragment = proxy.readFragment({
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

const WATCH_REPOSITORY_MUTATION = gql`
  mutation($id: ID!, $isWatch: SubscriptionState!) {
    updateSubscription(input: { state: $isWatch, subscribableId: $id }) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

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
            },
          },
        },
      });
    },
  }),
  options: {
    update: (proxy, props) => {
      const {
        id,
        viewerSubscription,
      } = props.data.updateSubscription.subscribable;

      const fragment = proxy.readFragment({
        id: `Repository:${id}`,
        fragment: REPOSITORY_FRAGMENT,
      });

      let { totalCount } = fragment.watchers;
      totalCount =
        viewerSubscription === 'SUBSCRIBED' ? totalCount + 1 : totalCount - 1;

      proxy.writeFragment({
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
    },
  },
};

const STAR_REPOSITORY = {
  STAR_REPOSITORY_MUTATION,
  STAR_REPOSITORY_CONFIG,
};

const UNSTAR_REPOSITORY = {
  UNSTAR_REPOSITORY_MUTATION,
  UNSTAR_REPOSITORY_CONFIG,
};

const WATCH_REPOSITORY = {
  WATCH_REPOSITORY_MUTATION,
  WATCH_REPOSITORY_CONFIG,
};

export { WATCH_REPOSITORY, STAR_REPOSITORY, UNSTAR_REPOSITORY };
