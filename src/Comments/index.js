import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../Loading';
import ErrorMessage from '../Error';
import FetchMore from '../FetchMore';
import AddComment from '../AddComment';

import './style.css';

const doFetchMore = fetchMore => (
  cursor,
  { repositoryOwner, repositoryName, number },
) =>
  fetchMore({
    variables: {
      cursor,
      repositoryOwner,
      repositoryName,
      number,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult) {
        return previousResult;
      }

      return {
        ...previousResult,
        repository: {
          ...previousResult.repository,
          issue: {
            ...previousResult.repository.issue,
            ...fetchMoreResult.repository.issue,
            comments: {
              ...previousResult.repository.issue.comments,
              ...fetchMoreResult.repository.issue.comments,
              edges: [
                ...previousResult.repository.issue.comments.edges,
                ...fetchMoreResult.repository.issue.comments.edges,
              ],
            },
          },
        },
      };
    },
  });

const Comments = ({ repositoryOwner, repositoryName, issue }) => (
  <Query
    query={COMMENTS_OF_ISSUE}
    variables={{
      cursor: null,
      repositoryOwner,
      repositoryName,
      number: issue.number,
    }}
  >
    {({ data, loading, error, fetchMore }) => {
      const { repository } = data;

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
              {repository.issue.comments.edges.map(comment => (
                <Comment key={comment.node.id} comment={comment.node} />
              ))}

              <FetchMore
                payload={{
                  repositoryOwner,
                  repositoryName,
                  number: issue.number,
                }}
                loading={loading}
                pageInfo={repository.issue.comments.pageInfo}
                doFetchMore={doFetchMore(fetchMore)}
              >
                Comments
              </FetchMore>
              <AddComment issueId={repository.issue.id} />
            </div>
          ) : (
            <AddComment issueId={repository.issue.id} />
          )}
        </div>
      );
    }}
  </Query>
);

const Comment = ({ comment }) => (
  <div className="Comment">
    <div>{comment.author.login}:</div>
    &nbsp;
    <div dangerouslySetInnerHTML={{ __html: comment.bodyHTML }} />
  </div>
);

const COMMENTS_OF_ISSUE = gql`
  query(
    $repositoryOwner: String!
    $repositoryName: String!
    $number: Int!
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issue(number: $number) {
        id
        comments(first: 5, after: $cursor) {
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
`;

export default Comments;
