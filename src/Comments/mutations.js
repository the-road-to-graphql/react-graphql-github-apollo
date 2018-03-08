import gql from 'graphql-tag';

const ADD_COMMENT_MUTATION = gql`
  mutation($subjectId: ID!, $body: String!, $clientMutationId: String) {
    addComment(
      input: {
        subjectId: $subjectId
        body: $body
        clientMutationId: $clientMutationId
      }
    ) {
      clientMutationId
      commentEdge {
        node {
          body
        }
      }
    }
  }
`;

const ADD_COMMENT_CONFIG = {
  name: 'onCommentAdd',
  options: ({ issue }) => ({
    variables: {
      subjectId: issue.id,
    },
  }),
};

const ADD_COMMENT = {
  ADD_COMMENT_MUTATION,
  ADD_COMMENT_CONFIG,
};

export { ADD_COMMENT };
