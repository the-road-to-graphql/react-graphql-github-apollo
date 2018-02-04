import React from 'react';

import './style.css';

const Loading = ({ isCenter }) => {
  const classNames = ['Loading'];

  if (isCenter) {
    classNames.push('Loading_center');
  }

  return (
    <div className={classNames.join(' ')}>
      <small>Loading ...</small>
    </div>
  );
}

export default Loading;
