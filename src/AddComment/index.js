import React, { Component } from 'react';

import TextArea from '../TextArea';
import Button from '../Button';

import './style.css';

class AddComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      displaySuccess: false,
      displayError: false,
    };
  }

  onChange = value => {
    this.setState({ value });
  };

  onSubmit = event => {
    event.preventDefault();
    const { value } = this.state;
    const { onCommentAdd } = this.props;

    onCommentAdd({
      variables: { body: value },
    })
      .then(({ data }) => {
        this.setState({ displaySuccess: true });
      })
      .catch(error => {
        this.setState({ displayError: true, errorMessage: error.toString() });
      });
  };

  renderMessage = () => {
    const { displaySuccess, displayError, errorMessage } = this.state;
    if (displaySuccess) {
      return (
        <div className="AddComment-message AddComment-message--success">
          Your comment has been posted
        </div>
      );
    } else if (displayError) {
      return (
        <div className="AddComment-message AddComment-message--error">
          {errorMessage}
        </div>
      );
    } else {
      return null;
    }
  };

  render() {
    const { value } = this.state;
    return (
      <div>
        {this.renderMessage()}
        <form onSubmit={this.onSubmit}>
          <TextArea
            value={value}
            onChange={e => this.onChange(e.target.value)}
            placeholder="Leave a comment"
          />
          <Button type="submit">Comment</Button>
        </form>
      </div>
    );
  }
}

export default AddComment;
