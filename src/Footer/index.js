import React from 'react';

import './style.css';

const Footer = () =>
  <div className="Footer">
    <div>
      <small>
        <span className="Footer-text">Built by</span>
        {' '}
        <a className="Footer-link" href="https://www.robinwieruch.de/">Robin</a>
        {' '}
        <span className="Footer-text">with &hearts;</span>
      </small>
    </div>
    <div>
      <small>
        <span className="Footer-text">Interested in GraphQL, Apollo and React?</span>
        {' '}
        <a className="Footer-link" href="https://www.getrevue.co/profile/rwieruch">Get updates</a>
        {' '}
        <span className="Footer-text">about upcoming articles, books & courses.</span>
      </small>
    </div>
  </div>

export default Footer;