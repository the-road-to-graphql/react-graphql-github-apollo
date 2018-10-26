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

const ISSUE_STATES = {
  NONE: 'NONE',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

const TRANSITION_LABELS = {
  [ISSUE_STATES.NONE]: 'Show Open Issues',
  [ISSUE_STATES.OPEN]: 'Show Closed Issues',
  [ISSUE_STATES.CLOSED]: 'Hide Issues',
};

const TRANSITION_STATE = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
};

const isShow = issueState => issueState !== ISSUE_STATES.NONE;

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

const prefetchIssues = (
  client,
  repositoryOwner,
  repositoryName,
  issueState,
) => {
  const nextIssueState = TRANSITION_STATE[issueState];

  if (isShow(nextIssueState)) {
    client.query({
      query: GET_ISSUES_OF_REPOSITORY,
      variables: {
        repositoryOwner,
        repositoryName,
        issueState: nextIssueState,
      },
    });
  }
};

const Issues = ({
  repositoryOwner,
  repositoryName,
  issueState,
  onChangeIssueState,
}) => (
  <div className="Issues">
    <IssueFilter
      repositoryOwner={repositoryOwner}
      repositoryName={repositoryName}
      issueState={issueState}
      onChangeIssueState={onChangeIssueState}
    />

    {isShow(issueState) && (
      <Query
        query={GET_ISSUES_OF_REPOSITORY}
        variables={{
          repositoryOwner,
          repositoryName,
          issueState,
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
            <IssueList
              issues={repository.issues}
              loading={loading}
              repositoryOwner={repositoryOwner}
              repositoryName={repositoryName}
              issueState={issueState}
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
  issueState,
  onChangeIssueState,
}) => (
  <ApolloConsumer>
    {client => (
      <ButtonUnobtrusive
        onClick={() =>
          onChangeIssueState(TRANSITION_STATE[issueState])
        }
        onMouseOver={() =>
          prefetchIssues(
            client,
            repositoryOwner,
            repositoryName,
            issueState,
          )
        }
      >
        {TRANSITION_LABELS[issueState]}
      </ButtonUnobtrusive>
    )}
  </ApolloConsumer>
);

const IssueList = ({
  issues,
  loading,
  repositoryOwner,
  repositoryName,
  issueState,
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
        issueState,
      }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      Issues
    </FetchMore>
  </div>
);

export default withState(
  'issueState',
  'onChangeIssueState',
  ISSUE_STATES.NONE,
)(Issues);
