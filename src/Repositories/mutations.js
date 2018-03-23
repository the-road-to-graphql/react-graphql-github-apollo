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
  mutation($id: ID!, $viewerSubscription: SubscriptionState!) {
    updateSubscription(
      input: { state: $viewerSubscription, subscribableId: $id }
    ) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const STAR_REPOSITORY = {
  STAR_REPOSITORY_MUTATION,
  STAR_REPOSITORY_CONFIG,
};

const UNSTAR_REPOSITORY = {
  UNSTAR_REPOSITORY_MUTATION,
  UNSTAR_REPOSITORY_CONFIG,
};

export { STAR_REPOSITORY, UNSTAR_REPOSITORY, WATCH_REPOSITORY_MUTATION };
