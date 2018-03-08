import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import * as routes from '../constants/routes';
import Button from '../Button';
import Input from '../Input';

import './style.css';

const Navigation = ({ location: { pathname }, value, onChange, onSubmit }) => (
  <header className="Navigation">
    <div className="Navigation-link">
      <Link to={routes.PROFILE}>Profile</Link>
    </div>
    <div className="Navigation-link">
      <Link to={routes.HOME}>Organization</Link>
    </div>

    {pathname === routes.HOME && (
      <OrganizationSearch
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    )}
  </header>
);

const OrganizationSearch = ({ value, onChange, onSubmit }) => (
  <div className="Navigation-search">
    <form onSubmit={onSubmit}>
      <Input
        color={'white'}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
      />{' '}
      <Button color={'white'} type="submit">
        Search
      </Button>
    </form>
  </div>
);

export default withRouter(Navigation);
