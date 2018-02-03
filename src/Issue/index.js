import React from 'react';
import { compose, withState } from 'recompose';

import Button from '../Button';

import './style.css';

const Issue = ({ issue, isShowComments, onShowComments, }) =>
  <div className="Issue">
    <Button onClick={() => onShowComments(!isShowComments)}>
      { isShowComments ? '-' : '+' }
    </Button>
    &nbsp;
    <div>
      <h3><a href={issue.url}>{issue.title}</a></h3>
      <div
        dangerouslySetInnerHTML={{ __html: issue.bodyHTML }}
      />
    </div>
  </div>

export default compose(
  withState('isShowComments', 'onShowComments', false)
)(Issue);