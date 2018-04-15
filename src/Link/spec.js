import React from 'react';
import ReactDOM from 'react-dom';
import Link from './';

it('renders', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Link />, div);
  ReactDOM.unmountComponentAtNode(div);
});
