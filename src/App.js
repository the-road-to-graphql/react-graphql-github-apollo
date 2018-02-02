import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withState } from 'recompose';

import './App.css';

const ORGANIZATION_DEFAULT = 'the-road-to-learn-react';

class App extends Component {
  constructor() {
    super();

    this.state = {
      search: ORGANIZATION_DEFAULT,
      organization: ORGANIZATION_DEFAULT,
      // organization: '',
    };
  }

  onSubmit = (event) => {
    const { search } = this.state;

    this.setState({ organization: search });

    event.preventDefault();
  }

  render() {
    const { search, organization } = this.state;

    return (
      <div className="App">
        <div className="App-content">
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              value={search}
              onChange={e => this.setState({ search: e.target.value })}
            />
            <button type="submit">Send</button>
          </form>

          <Repositories organization={organization} />
        </div>
      </div>
    );
  }
}

const RepositoriesPresenter = ({
  data,
  onWatchToggle,
}) => {
  if (!data) {
    return null;
  }

  const {
    loading,
    error,
    organization,
    fetchMore,
  } = data;

  if (error) {
    return (
      <div>
        <p><strong>Something went wrong:</strong> {error.toString()}</p>
      </div>
    );
  }

  if (!organization && <p>Loading ...</p>) {
    return <Loading />;
  }

  return (
    <div>
      <FetchMoreButton
        loading={loading}
        pageInfo={organization.repositories.pageInfo}
        fetchMore={fetchMore}
      />

      <div>
        {organization.repositories.edges.map(repository =>
          <div key={repository.node.id}>
            <Repository
              { ...repository.node }
              onWatchToggle={onWatchToggle}
            />
            <Issues
              organizationLogin={organization.login}
              repositoryName={repository.node.name}
            />
            <hr />
          </div>
        )}
      </div>
    </div>
  );
}

const IssuesPresenter = ({ organizationLogin, repositoryName, isShow, onShow }) =>
  <div>
    <button
      onClick={() => onShow(!isShow)}
      type="button"
    >
      { isShow ? 'Hide Issues' : 'Show Issues' }
    </button>

    <IssuesList
      organizationLogin={organizationLogin}
      repositoryName={repositoryName}
      isShow={isShow}
    />
  </div>

const Issues = withState('isShow', 'onShow', false)(IssuesPresenter);

const IssuesListPresenter = ({ isShow, data }) => {
  if (!isShow || !data) {
    return null;
  }

  const {
    error,
    organization,
  } = data;

  if (error) {
    return (
      <div>
        <p><strong>Something went wrong:</strong> {error.toString()}</p>
      </div>
    );
  }

  const { issues } = organization.repository;

  return (
    issues.edges.length ? (
      <div>
        {data.organization.repository.issues.edges.map(issue =>
          <div key={issue.node.id}>{issue.node.title}</div>
        )}
      </div>
    ) : (
      <div>
        <p><strong>No [STATE] issues</strong></p>
      </div>
    )
  );
}

const IssuesOfRepository = gql`
  query IssuesOfRepository($organizationLogin: String!, $repositoryName: String!) {
    organization(login: $organizationLogin) {
      name
      url
      repository(name: $repositoryName) {
        issues(last: 3, states: [OPEN]) {
          edges {
            node {
              id
              title
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`

const IssuesList = graphql(IssuesOfRepository, {
    options: ({ organizationLogin, repositoryName }) => ({
      variables: {
        organizationLogin,
        repositoryName,
      },
      // skip: organization === '',
      // notifyOnNetworkStatusChange: true,
    }),
  })(IssuesListPresenter);

const FetchMoreButton = ({
  loading,
  pageInfo,
  fetchMore,
}) =>
  <div>
    {
      loading ? (
        <Loading />
      ) : (
        <button
          onClick={() => doFetchMore(fetchMore, pageInfo.endCursor)}
          type="button"
          disabled={!pageInfo.hasNextPage}
        >
          More
        </button>
      )
    }
  </div>

const Loading = () =>
  <p>Loading ...</p>

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
  onWatchToggle
}) =>
  <div className="Repository">
    <h2><a href={url}>{name}</a></h2>

    <p>{description}</p>

    <div className="Repository-details">
      <p>Stars: {stargazers.totalCount}</p>
      <p>Forks: {forks.totalCount}</p>

      {viewerSubscription === 'SUBSCRIBED'
        ? (
            <button
              onClick={() => onWatchToggle(id, 'UNSUBSCRIBED')}
              type="button"
            >
              {watchers.totalCount} Unwatch
            </button>
        ) : (
          <button
            onClick={() => onWatchToggle(id, 'SUBSCRIBED')}
            type="button"
          >
            {watchers.totalCount} Watch
          </button>
        )
      }
    </div>
  </div>

const doFetchMore = (fetchMore, cursor) => fetchMore({
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
      organization: {
        ...previousResult.organization,
        repositories: {
          ...previousResult.organization.repositories,
          ...fetchMoreResult.organization.repositories,
          edges: [
            ...previousResult.organization.repositories.edges,
            ...fetchMoreResult.organization.repositories.edges,
          ],
        }
      }
    }
  },
});

const RepositoryFragment = gql`
  fragment repository on Repository {
    id
    name
    url
    description
    stargazers {
      totalCount
    }
    viewerHasStarred
    forks {
      totalCount
    }
    watchers {
      totalCount
    }
    viewerSubscription
  }
`

const RepositoriesOfOrganization = gql`
  query RepositoriesOfOrganization($organization: String!, $cursor: String) {
    organization(login: $organization) {
      name
      login
      url
      repositories(first: 3, after: $cursor) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }

  ${RepositoryFragment}
`

const WatchRepository = gql`
  mutation updateSubscription($id: ID!, $isWatch: SubscriptionState!) {
    updateSubscription(input:{state: $isWatch, subscribableId: $id}) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`

const Repositories = compose(
  graphql(RepositoriesOfOrganization, {
    options: ({ organization }) => ({
      variables: {
        organization,
        cursor: null,
      },
      skip: organization === '',
      notifyOnNetworkStatusChange: true,
    }),
  }),
  graphql(WatchRepository, {
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
          fragment: RepositoryFragment,
        });

        let { totalCount } = fragment.watchers;
        totalCount = viewerSubscription === 'SUBSCRIBED'
          ? totalCount + 1
          : totalCount - 1;

        proxy.writeFragment({
          id: `Repository:${id}`,
          fragment: RepositoryFragment,
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
  }),
)(RepositoriesPresenter);

export default App;