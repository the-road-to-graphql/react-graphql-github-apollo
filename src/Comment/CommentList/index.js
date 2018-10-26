import React, { Fragment } from 'react';
import { Query } from 'react-apollo';

import { GET_COMMENTS_OF_ISSUE } from './queries';
import CommentItem from '../CommentItem';
import CommentAdd from '../CommentAdd';

import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import FetchMore from '../../FetchMore';

import './style.css';

const updateQuery = (previousResult, { fetchMoreResult }) => {
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
};

const Comments = ({ repositoryOwner, repositoryName, issue }) => (
  <Query
    query={GET_COMMENTS_OF_ISSUE}
    variables={{
      repositoryOwner,
      repositoryName,
      number: issue.number,
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

      return (
        <Fragment>
          <CommentList
            comments={repository.issue.comments}
            loading={loading}
            number={issue.number}
            repositoryOwner={repositoryOwner}
            repositoryName={repositoryName}
            fetchMore={fetchMore}
          />

          <CommentAdd issueId={repository.issue.id} />
        </Fragment>
      );
    }}
  </Query>
);

const CommentList = ({
  comments,
  loading,
  repositoryOwner,
  repositoryName,
  number,
  fetchMore,
}) => (
  <div className="CommentList">
    {comments.edges.map(({ node }) => (
      <CommentItem key={node.id} comment={node} />
    ))}

    <FetchMore
      loading={loading}
      hasNextPage={comments.pageInfo.hasNextPage}
      variables={{
        cursor: comments.pageInfo.endCursor,
        repositoryOwner,
        repositoryName,
        number,
      }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      Comments
    </FetchMore>
  </div>
);

export default Comments;
