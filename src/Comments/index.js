import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../Loading';
import ErrorMessage from '../Error';

import './style.css';

const Comments = ({
  data: {
    loading,
    error,
    repository,
    fetchMore,
  },
}) => {
  if (loading && !repository) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="Comments">
      {repository.issue.comments.edges.length ? (
        <div>
          {repository.issue.comments.edges.map(comment =>
            <Comment
              key={comment.node.id}
              comment={comment.node}
            />
          )}
        </div>
      ) : (
        <div>
          No comments ...
        </div>
      )}
    </div>
  );
}

const Comment = ({ comment }) =>
  <div className="Comment">
    <div>{comment.author.login}:</div>
    &nbsp;
    <div
      dangerouslySetInnerHTML={{ __html: comment.bodyHTML }}
    />
  </div>

const COMMENTS_OF_ISSUE = gql`
  query ($repositoryOwner: String!, $repositoryName: String!, $number: Int!) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issue(number: $number) {
        comments(first: 5) {
          edges {
            node {
              id
              bodyHTML
              author {
                login
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
  }
`

const COMMENTS_OF_ISSUE_CONFIG = {
  options: ({ issue, repositoryOwner, repositoryName }) => ({
    variables: {
      repositoryOwner,
      repositoryName,
      number: issue.number,
    },
  }),
};

export default graphql(
  COMMENTS_OF_ISSUE,
  COMMENTS_OF_ISSUE_CONFIG
)(Comments);