import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { compose, withState } from 'recompose';

import { ButtonUnobtrusive } from '../Button';
import Loading from '../Loading';
import ErrorMessage from '../Error';

import './style.css';

const KIND_OF_ISSUES = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

const prefetchIssues = (client, repositoryOwner, repositoryName, kindOfIssue) => {
  client.query({
    query: ISSUES_OF_REPOSITORY,
    variables: {
      repositoryOwner,
      repositoryName,
      kindOfIssue,
    },
  });
};

const IssuesPresenter = ({
  repositoryOwner,
  repositoryName,
  isShow,
  kindOfIssue,
  onShow,
  onChangeKindOfIssue,
  client,
}) =>
  <div className="Issues">
    <ButtonUnobtrusive
      onClick={() => onShow(!isShow)}
      onMouseOver={prefetchIssues(client, repositoryOwner, repositoryName, kindOfIssue)}
    >
      { isShow ? 'Hide Issues' : 'Show Issues' }
    </ButtonUnobtrusive>

    { isShow ? (
      <div className="Issues-content">
        <IssuesList
          repositoryOwner={repositoryOwner}
          repositoryName={repositoryName}
          kindOfIssue={kindOfIssue}
          isShow={isShow}
        />

        <ButtonUnobtrusive
          onClick={() => onChangeKindOfIssue(kindOfIssue === KIND_OF_ISSUES.OPEN ? KIND_OF_ISSUES.CLOSED : KIND_OF_ISSUES.OPEN)}
          onMouseOver={prefetchIssues(client, repositoryOwner, repositoryName, kindOfIssue === KIND_OF_ISSUES.OPEN ? KIND_OF_ISSUES.CLOSED : KIND_OF_ISSUES.OPEN)}
        >
          { kindOfIssue === KIND_OF_ISSUES.OPEN ? 'Only Closed Issues' : 'Only Open Issues' }
        </ButtonUnobtrusive>
      </div>
    ) : (
      null
    )}
  </div>

const IssuesListPresenter = ({
  isShow,
  kindOfIssue,
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

  const { issues } = repository;

  return (
    <div className="IssueList">
      {issues.edges.length ? (
        <div>
          {issues.edges.map(issue =>
            <div key={issue.node.id}>
              <a href={issue.node.url}>{issue.node.title}</a>
            </div>
          )}
        </div>
      ) : (
        <div>
          No {kindOfIssue} issues ...
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
            title
            url
            bodyText
            editor {
              avatarUrl
              login
              url
            }
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
  options: ({ repositoryOwner, repositoryName, isShow, kindOfIssue }) => ({
    variables: {
      repositoryOwner,
      repositoryName,
      kindOfIssue,
    },
    skip: !isShow,
  }),
};

const IssuesList = graphql(
  ISSUES_OF_REPOSITORY,
  ISSUES_OF_REPOSITORY_CONFIG
)(IssuesListPresenter);

export default compose(
  withState('isShow', 'onShow', false),
  withState('kindOfIssue', 'onChangeKindOfIssue', KIND_OF_ISSUES.OPEN),
  withApollo
)(IssuesPresenter);