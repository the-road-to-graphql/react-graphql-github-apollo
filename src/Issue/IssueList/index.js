import React from 'react';
import { Query, ApolloConsumer } from 'react-apollo';
import { withState } from 'recompose';

import { GET_ISSUES_OF_REPOSITORY } from './queries';
import IssueItem from '../IssueItem';

import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import FetchMore from '../../FetchMore';
import { ButtonUnobtrusive } from '../../Button';

import './style.css';

const SHOW_STATES = {
  NO_ISSUES: 'NONE',
  OPEN_ISSUES: 'OPEN',
  CLOSED_ISSUES: 'CLOSED',
};

const SHOW_TRANSITION_LABELS = {
  [SHOW_STATES.NO_ISSUES]: 'Show Open Issues',
  [SHOW_STATES.OPEN_ISSUES]: 'Show Closed Issues',
  [SHOW_STATES.CLOSED_ISSUES]: 'Hide Issues',
};

const SHOW_TRANSITION_STATE = {
  [SHOW_STATES.NO_ISSUES]: SHOW_STATES.OPEN_ISSUES,
  [SHOW_STATES.OPEN_ISSUES]: SHOW_STATES.CLOSED_ISSUES,
  [SHOW_STATES.CLOSED_ISSUES]: SHOW_STATES.NO_ISSUES,
};

const KIND_OF_ISSUES = {
  [SHOW_STATES.OPEN_ISSUES]: 'OPEN',
  [SHOW_STATES.CLOSED_ISSUES]: 'CLOSED',
};

const isShow = showState => showState !== SHOW_STATES.NO_ISSUES;

const prefetchIssues = (
  client,
  repositoryOwner,
  repositoryName,
  showState,
) => {
  const nextShowState = SHOW_TRANSITION_STATE[showState];

  if (isShow(nextShowState)) {
    client.query({
      query: GET_ISSUES_OF_REPOSITORY,
      variables: {
        repositoryOwner,
        repositoryName,
        kindOfIssue: KIND_OF_ISSUES[nextShowState],
      },
    });
  }
};

const updateQuery = (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    repository: {
      ...previousResult.repository,
      issues: {
        ...previousResult.repository.issues,
        ...fetchMoreResult.repository.issues,
        edges: [
          ...previousResult.repository.issues.edges,
          ...fetchMoreResult.repository.issues.edges,
        ],
      },
    },
  };
};

const Issues = ({
  repositoryOwner,
  repositoryName,
  showState,
  onChangeShowState,
}) => (
  <div className="Issues">
    <IssueFilter
      repositoryOwner={repositoryOwner}
      repositoryName={repositoryName}
      showState={showState}
      onChangeShowState={onChangeShowState}
    />

    {isShow(showState) && (
      <Query
        query={GET_ISSUES_OF_REPOSITORY}
        variables={{
          repositoryOwner,
          repositoryName,
          kindOfIssue: KIND_OF_ISSUES[showState],
        }}
        notifyOnNetworkStatusChange={true}
      >
        {({ data, loading, error, fetchMore }) => {
          if (error) {
            return <ErrorMessage error={error} />;
          }

          const { repository } = data;

          if (loading && !repository) {
            return <Loading />;
          }

          if (!repository.issues.edges.length) {
            return <div className="IssueList">No issues ...</div>;
          }

          return (
            <IssuesList
              issues={repository.issues}
              loading={loading}
              repositoryOwner={repositoryOwner}
              repositoryName={repositoryName}
              showState={showState}
              fetchMore={fetchMore}
            />
          );
        }}
      </Query>
    )}
  </div>
);

const IssueFilter = ({
  repositoryOwner,
  repositoryName,
  showState,
  onChangeShowState,
}) => (
  <ApolloConsumer>
    {client => (
      <ButtonUnobtrusive
        onClick={() =>
          onChangeShowState(SHOW_TRANSITION_STATE[showState])
        }
        onMouseOver={() =>
          prefetchIssues(
            client,
            repositoryOwner,
            repositoryName,
            showState,
          )
        }
      >
        {SHOW_TRANSITION_LABELS[showState]}
      </ButtonUnobtrusive>
    )}
  </ApolloConsumer>
);

const IssuesList = ({
  issues,
  loading,
  repositoryOwner,
  repositoryName,
  showState,
  fetchMore,
}) => (
  <div className="IssueList">
    {issues.edges.map(({ node }) => (
      <IssueItem
        key={node.id}
        issue={node}
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
      />
    ))}

    <FetchMore
      loading={loading}
      hasNextPage={issues.pageInfo.hasNextPage}
      variables={{
        cursor: issues.pageInfo.endCursor,
        repositoryOwner,
        repositoryName,
        kindOfIssue: KIND_OF_ISSUES[showState],
      }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      Issues
    </FetchMore>
  </div>
);

export default withState(
  'showState',
  'onChangeShowState',
  SHOW_STATES.NO_ISSUES,
)(Issues);
