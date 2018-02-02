import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { compose, withState } from 'recompose';

import Loading from '../Loading';

const KIND_OF_ISSUES = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

const prefetchIssues = (client, organizationLogin, repositoryName, kindOfIssue) => {
  client.query({
    query: ISSUES_OF_REPOSITORY,
    variables: {
      organizationLogin,
      repositoryName,
      kindOfIssue,
    },
  });
};

const IssuesPresenter = ({
  organizationLogin,
  repositoryName,
  isShow,
  kindOfIssue,
  onShow,
  onChangeKindOfIssue,
  client,
}) =>
  <div>
    <button
      onClick={() => onShow(!isShow)}
      onMouseOver={prefetchIssues(client, organizationLogin, repositoryName, kindOfIssue)}
      type="button"
    >
      { isShow ? 'Hide Issues' : 'Show Issues' }
    </button>

    { isShow &&
      <button
        onClick={() => onChangeKindOfIssue(kindOfIssue === KIND_OF_ISSUES.OPEN ? KIND_OF_ISSUES.CLOSED : KIND_OF_ISSUES.OPEN)}
        onMouseOver={prefetchIssues(client, organizationLogin, repositoryName, kindOfIssue === KIND_OF_ISSUES.OPEN ? KIND_OF_ISSUES.CLOSED : KIND_OF_ISSUES.OPEN)}
        type="button"
      >
        { kindOfIssue === KIND_OF_ISSUES.OPEN ? 'Only Closed Issues' : 'Only Open Issues' }
      </button>
    }

    { isShow &&
      <IssuesList
        organizationLogin={organizationLogin}
        repositoryName={repositoryName}
        kindOfIssue={kindOfIssue}
        isShow={isShow}
      />
    }
  </div>

const IssuesListPresenter = ({
  isShow,
  data: {
    error,
    loading,
    organization,
  },
}) => {
  if (loading) {
    return (
      <div>
        <Loading />
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

  const { issues } = organization.repository;

  return (
    issues.edges.length ? (
      <div>
        {organization.repository.issues.edges.map(issue =>
          <div key={issue.node.id}>
            <a href={issue.node.url}>{issue.node.title}</a>
          </div>
        )}
      </div>
    ) : (
      <div>
        <p><strong>No [STATE] issues</strong></p>
      </div>
    )
  );
}

const ISSUES_OF_REPOSITORY = gql`
  query ($organizationLogin: String!, $repositoryName: String!, $kindOfIssue: IssueState!) {
    organization(login: $organizationLogin) {
      name
      url
      repository(name: $repositoryName) {
        issues(last: 5, states: [$kindOfIssue]) {
          edges {
            node {
              id
              title
              url
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

const IssuesList = graphql(ISSUES_OF_REPOSITORY, {
    options: ({ organizationLogin, repositoryName, isShow, kindOfIssue }) => ({
      variables: {
        organizationLogin,
        repositoryName,
        kindOfIssue,
      },
      skip: !isShow,
    }),
  })(IssuesListPresenter);

export default compose(
  withState('isShow', 'onShow', false),
  withState('kindOfIssue', 'onChangeKindOfIssue', KIND_OF_ISSUES.OPEN),
  withApollo
)(IssuesPresenter);