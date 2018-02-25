import React from 'react';

import './style.css';

const TextArea = ({ children, ...props }) => (
  <textarea className={`TextArea`} {...props}>
    {children}
  </textarea>
);

export default TextArea;
