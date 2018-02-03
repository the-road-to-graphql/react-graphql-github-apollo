import React from 'react';
import { withState } from 'recompose';

import Button from '../Button';
import Comments from '../Comments';

import './style.css';

const Issue = ({
  issue,
  repositoryOwner,
  repositoryName,
  isShowComments,
  onShowComments,
}) =>
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

      {isShowComments && (
        <Comments
          repositoryOwner={repositoryOwner}
          repositoryName={repositoryName}
          issue={issue}
        />
      )}
    </div>
  </div>

export default withState('isShowComments', 'onShowComments', false)(Issue);
