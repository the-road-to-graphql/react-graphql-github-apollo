import React, { Component } from 'react';

import TextArea from '../TextArea';
import Button from '../Button';

import './style.css';

class AddComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
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
      variables: { body: value }
    })
      .then(({ data }) => {
        console.log('got data', data);
      })
      .catch(error => {
        console.log('there was an error sending the query', error);
      });
  };

  render() {
    const { value } = this.state;
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <TextArea value={value} onChange={e => this.onChange(e.target.value)} placeholder="Leave a comment" />
          <Button type="submit">Comment</Button>
        </form>
      </div>
    );
  }
}

export default AddComment;
