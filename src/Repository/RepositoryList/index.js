import React from 'react';

import RepositoryItem from '../RepositoryItem';

import '../style.css';

const RepositoryList = ({ repositories }) =>
  repositories.edges.map(({ node }) => (
    <div key={node.id} className="Repository">
      <RepositoryItem {...node} />
    </div>
  ));

export default RepositoryList;
