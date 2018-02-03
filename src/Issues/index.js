import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { compose, withState } from 'recompose';

import Issue from '../Issue';
import { ButtonUnobtrusive } from '../Button';
import Loading from '../Loading';
import ErrorMessage from '../Error';

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

const isShow = (showState) =>
  showState !== SHOW_STATES.NO_ISSUES;

const prefetchIssues = (client, repositoryOwner, repositoryName, showState) => {
  const nextShowState = SHOW_TRANSITION_STATE[showState];

  if (isShow(nextShowState)) {
    client.query({
      query: ISSUES_OF_REPOSITORY,
      variables: {
        repositoryOwner,
        repositoryName,
        kindOfIssue: KIND_OF_ISSUES[nextShowState],
      },
    });
  }
};

const IssuesPresenter = ({
  repositoryOwner,
  repositoryName,
  showState,
  onChangeShowState,
  client,
}) =>
  <div className="Issues">
    <ButtonUnobtrusive
      onClick={() => onChangeShowState(SHOW_TRANSITION_STATE[showState])}
      onMouseOver={prefetchIssues(client, repositoryOwner, repositoryName, showState)}
    >
      {SHOW_TRANSITION_LABELS[showState]}
    </ButtonUnobtrusive>

    {isShow(showState) && (
      <IssuesList
        showState={showState}
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
      />
    )}
  </div>

const IssuesListPresenter = ({
  repositoryOwner,
  repositoryName,
  data: {
    error,
    loading,
    repository,
  },
}) => {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="IssueList">
      {repository.issues.edges.length ? (
        <div>
          {repository.issues.edges.map(issue =>
            <Issue
              key={issue.node.id}
              issue={issue.node}
              repositoryOwner={repositoryOwner}
              repositoryName={repositoryName}
            />
          )}
        </div>
      ) : (
        <div>
          No issues ...
        </div>
      )}
    </div>
  );
}

const ISSUES_OF_REPOSITORY = gql`
  query ($repositoryOwner: String!, $repositoryName: String!, $kindOfIssue: IssueState!) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(last: 5, states: [$kindOfIssue]) {
        edges {
          node {
            id
            number
            title
            url
            bodyHTML
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`

const ISSUES_OF_REPOSITORY_CONFIG = {
  options: ({ repositoryOwner, repositoryName, showState }) => ({
    variables: {
      repositoryOwner,
      repositoryName,
      kindOfIssue: KIND_OF_ISSUES[showState],
    },
    skip: !isShow(showState),
  }),
};

const IssuesList = graphql(
  ISSUES_OF_REPOSITORY,
  ISSUES_OF_REPOSITORY_CONFIG
)(IssuesListPresenter);

export default compose(
  withState('showState', 'onChangeShowState', SHOW_STATES.NO_ISSUES),
  withApollo
)(IssuesPresenter);