import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';

import logo from './logo.svg';
import './App.css';

const ORGANIZATION_DEFAULT = 'the-road-to-learn-react';

class App extends Component {
  constructor() {
    super();

    this.state = {
      input: ORGANIZATION_DEFAULT,
    };
  }

  onSubmit = (event) => {
    const { refetch } = this.props.data;
    const { input } = this.state;

    event.preventDefault();

    refetch({ organization: input });
  }

  render() {
    const { input } = this.state;
    const { data, onWatchToggle } = this.props;
    const { loading, error, organization } = data;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome</h1>
        </header>

        <div className="App-content">
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              value={input}
              onChange={event => this.setState({ input: event.target.value })}
            />
            <button type="submit">Send</button>
          </form>

          <Organization
            organization={organization}
            loading={loading}
            error={error}
            onWatchToggle={onWatchToggle}
          />
        </div>
      </div>
    );
  }
}

const Organization = ({ organization, loading, error, onWatchToggle }) => {
  if (loading) {
    return (
      <div>
        <p>Loading ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p><strong>Something went wrong:</strong> {error.toString()}</p>
      </div>
    );
  }

  return (
    <div className="Repositories">
      {organization.repositories.edges.map(repository =>
        <div key={repository.node.id}>
          <Repository
            { ...repository.node }
            onWatchToggle={onWatchToggle}
          />
          <hr />
        </div>
      )}
    </div>
  );
}

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
  query RepositoriesOfOrganization($organization: String!) {
    organization(login: $organization) {
      name
      url
      repositories(first: 10) {
        edges {
          node {
            ...repository
          }
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

export default compose(
  graphql(RepositoriesOfOrganization, {
    options: {
      variables: {
        organization: ORGANIZATION_DEFAULT,
      }
    },
  }),
  graphql(WatchRepository, {
    name: 'watchRepository',
    props: ({ watchRepository }) => ({
      onWatchToggle: (id, isWatch) =>
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
    }),
    options: {
      update: (proxy, props) => {
        const { id, viewerSubscription } = props.data.updateSubscription.subscribable;

        const fragment = proxy.readFragment({
          id: `Repository:${id}`,
          fragment: RepositoryFragment,
        });

        const totalCount = viewerSubscription === 'SUBSCRIBED'
          ? fragment.watchers.totalCount + 1
          : fragment.watchers.totalCount - 1;

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
)(App);
