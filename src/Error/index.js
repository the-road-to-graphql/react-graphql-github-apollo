import React from 'react';

import './style.css';

const ErrorMessage = ({ error }) => (
  <div className="Error">
    <small>{error.toString()}</small>
  </div>
);

export default ErrorMessage;
