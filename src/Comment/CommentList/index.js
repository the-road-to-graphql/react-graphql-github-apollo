import React from 'react';
import { Query } from 'react-apollo';
import { lensPath, set, view, compose } from 'ramda';

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

      const commentsLens = lensPath(['repository', 'issue', 'comments']);
      const edgesLens = lensPath(['repository', 'issue', 'comments', 'edges']);

      const updatedCommentsEdges = [
        ...view(edgesLens, previousResult),
        ...view(edgesLens, fetchMoreResult),
      ];

      return compose(
        set(edgesLens, updatedCommentsEdges),
        set(commentsLens, view(commentsLens, fetchMoreResult)),
      )(previousResult);
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

      return (
        <div className="CommentList">
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
