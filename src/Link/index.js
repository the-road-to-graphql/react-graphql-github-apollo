import React from 'react';

const Link = ({ children, ...props }) => (
  <a {...props} target="_blank">
    {children}
  </a>
);

export default Link;
