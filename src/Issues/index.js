import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { compose, withState } from 'recompose';

import Issue from '../Issue';
import Loading from '../Loading';
import ErrorMessage from '../Error';
import FetchMore from '../FetchMore';
import { ButtonUnobtrusive } from '../Button';

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
  data,
  client,
}) => (
  <div className="Issues">
    <ButtonUnobtrusive
      onClick={() => onChangeShowState(SHOW_TRANSITION_STATE[showState])}
      onMouseOver={prefetchIssues(
        client,
        repositoryOwner,
        repositoryName,
        showState,
      )}
    >
      {SHOW_TRANSITION_LABELS[showState]}
    </ButtonUnobtrusive>

    {isShow(showState) && (
      <IssuesList
        showState={showState}
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
        data={data}
      />
    )}
  </div>
);

const IssuesList = ({
  showState,
  repositoryOwner,
  repositoryName,
  data: { error, loading, repository, fetchMore },
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
          {repository.issues.edges.map(issue => (
            <Issue
              key={issue.node.id}
              issue={issue.node}
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
      ) : (
        <div>No issues ...</div>
      )}
    </div>
  );
};

const ISSUES_OF_REPOSITORY = gql`
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $kindOfIssue: IssueState!
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5, states: [$kindOfIssue], after: $cursor) {
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
`;

const ISSUES_OF_REPOSITORY_CONFIG = {
  options: ({ repositoryOwner, repositoryName, showState }) => ({
    variables: {
      cursor: null,
      repositoryOwner,
      repositoryName,
      kindOfIssue: KIND_OF_ISSUES[showState],
    },
    skip: !isShow(showState),
  }),
};

export default compose(
  withState('showState', 'onChangeShowState', SHOW_STATES.NO_ISSUES),
  graphql(ISSUES_OF_REPOSITORY, ISSUES_OF_REPOSITORY_CONFIG),
  withApollo,
)(Issues);
