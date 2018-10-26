import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

import { ADD_COMMENT } from './mutations';

import TextArea from '../../TextArea';
import Button from '../../Button';
import ErrorMessage from '../../Error';

class CommentAdd extends Component {
  state = {
    value: '',
  };

  onChange = value => {
    this.setState({ value });
  };

  onSubmit = (event, addComment) => {
    addComment().then(() => this.setState({ value: '' }));

    event.preventDefault();
  };

  render() {
    const { issueId } = this.props;
    const { value } = this.state;

    return (
      <Mutation
        mutation={ADD_COMMENT}
        variables={{ body: value, subjectId: issueId }}
      >
        {(addComment, { data, loading, error }) => (
          <div>
            {error && <ErrorMessage error={error} />}

            <form onSubmit={e => this.onSubmit(e, addComment)}>
              <TextArea
                value={value}
                onChange={e => this.onChange(e.target.value)}
                placeholder="Leave a comment"
              />
              <Button type="submit">Comment</Button>
            </form>
          </div>
        )}
      </Mutation>
    );
  }
}

export default CommentAdd;
