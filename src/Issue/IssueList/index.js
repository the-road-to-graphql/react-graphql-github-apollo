import React from 'react';
import { Query, ApolloConsumer } from 'react-apollo';
import { withState } from 'recompose';

import { ISSUES_OF_REPOSITORY } from './queries';
import IssueItem from '../IssueItem';

import LoadingIndicator from '../../Loading';
import ErrorMessage from '../../Error';
import FetchMore from '../../FetchMore';
import { ButtonUnobtrusive } from '../../Button';

import './style.css';

const SHOW_STATES = {
  NO_ISSUES: 'NO_ISSUES',
  OPEN_ISSUES: 'OPEN_ISSUES',
  CLOSED_ISSUES: 'CLOSES_ISSUES',
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

const prefetchIssues = (client, repositoryOwner, repositoryName, showState) => {
  const nextShowState = SHOW_TRANSITION_STATE[showState];

  if (isShow(nextShowState)) {
    client.query({
      query: ISSUES_OF_REPOSITORY,
      variables: {
        cursor: null,
        repositoryOwner,
        repositoryName,
        kindOfIssue: KIND_OF_ISSUES[nextShowState],
      },
    });
  }
};

const doFetchMore = fetchMore => (
  cursor,
  { repositoryOwner, repositoryName, showState },
) =>
  fetchMore({
    variables: {
      cursor,
      repositoryOwner,
      repositoryName,
      kindOfIssue: KIND_OF_ISSUES[showState],
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
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
    },
  });

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
      <IssuesList
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
        showState={showState}
      />
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
        onClick={() => onChangeShowState(SHOW_TRANSITION_STATE[showState])}
        onMouseOver={() =>
          prefetchIssues(client, repositoryOwner, repositoryName, showState)
        }
      >
        {SHOW_TRANSITION_LABELS[showState]}
      </ButtonUnobtrusive>
    )}
  </ApolloConsumer>
);

const IssuesList = ({ repositoryOwner, repositoryName, showState }) => (
  <Query
    query={ISSUES_OF_REPOSITORY}
    variables={{
      cursor: null,
      repositoryOwner,
      repositoryName,
      kindOfIssue: KIND_OF_ISSUES[showState],
    }}
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      const { repository } = data;

      if (loading && !repository) {
        return <LoadingIndicator />;
      }

      if (error) {
        return <ErrorMessage error={error} />;
      }

      if (!repository.issues.edges.length) {
        return <div className="IssueList">No issues ...</div>;
      }

      return (
        <div className="IssueList">
          {repository.issues.edges.map(({ node }) => (
            <IssueItem
              key={node.id}
              issue={node}
              repositoryOwner={repositoryOwner}
              repositoryName={repositoryName}
            />
          ))}

          <FetchMore
            payload={{
              repositoryOwner,
              repositoryName,
              showState,
            }}
            loading={loading}
            pageInfo={repository.issues.pageInfo}
            doFetchMore={doFetchMore(fetchMore)}
          >
            Issues
          </FetchMore>
        </div>
      );
    }}
  </Query>
);

export default withState(
  'showState',
  'onChangeShowState',
  SHOW_STATES.NO_ISSUES,
)(Issues);
