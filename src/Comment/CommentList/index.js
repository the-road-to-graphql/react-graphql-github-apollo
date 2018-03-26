import React from 'react';
import { Query } from 'react-apollo';

import { COMMENTS_OF_ISSUE } from './queries';
import CommentItem from '../CommentItem';
import CommentAdd from '../CommentAdd';

import LoadingIndicator from '../../Loading';
import ErrorMessage from '../../Error';
import FetchMore from '../../FetchMore';

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

const CommentList = ({ repositoryOwner, repositoryName, issue }) => (
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
        return <LoadingIndicator />;
      }

      if (error) {
        return <ErrorMessage error={error} />;
      }

      return (
        <div className="Comments">
          {repository.issue.comments.edges.map(({ node }) => (
            <CommentItem key={node.id} comment={node} />
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

          <CommentAdd issueId={repository.issue.id} />
        </div>
      );
    }}
  </Query>
);

export default CommentList;
