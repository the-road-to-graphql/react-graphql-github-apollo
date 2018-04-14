import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import * as routes from '../../constants/routes';
import Button from '../../Button';
import Input from '../../Input';

import './style.css';

const Navigation = ({
  location: { pathname },
  initialValue,
  onOrganizationSearch,
}) => (
  <header className="Navigation">
    <div className="Navigation-link">
      <Link to={routes.PROFILE}>Profile</Link>
    </div>
    <div className="Navigation-link">
      <Link to={routes.HOME}>Organization</Link>
    </div>

    {pathname === routes.HOME && (
      <OrganizationSearch
        initialValue={initialValue}
        onOrganizationSearch={onOrganizationSearch}
      />
    )}
  </header>
);

class OrganizationSearch extends React.Component {
  state = {
    value: this.props.initialValue,
  };

  onChange = event => {
    this.setState({ value: event.target.value });
  };

  onSubmit = event => {
    this.props.onOrganizationSearch(this.state.value);

    event.preventDefault();
  };

  render() {
    const { value } = this.state;

    return (
      <div className="Navigation-search">
        <form onSubmit={this.onSubmit}>
          <Input
            color={'white'}
            type="text"
            value={value}
            onChange={this.onChange}
          />{' '}
          <Button color={'white'} type="submit">
            Search
          </Button>
        </form>
      </div>
    );
  }
}

export default withRouter(Navigation);
