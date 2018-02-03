import React from 'react';

import './style.css';

const Button = ({
  children,
  color = 'black',
  ...props
}) =>
  <button
    className={`Button Button_${color}`}
    { ...props }
  >
    {children}
  </button>

export default Button;
