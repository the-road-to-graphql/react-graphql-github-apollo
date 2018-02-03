import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Navigation from '../Navigation';
import OrganizationPage from '../Organization';
import ProfilePage from '../Profile';

import * as routes from '../constants/routes';

const ORGANIZATION_DEFAULT = 'the-road-to-learn-react';

class App extends Component {
  constructor() {
    super();

    this.state = {
      value: ORGANIZATION_DEFAULT,
      organization: ORGANIZATION_DEFAULT,
      // organization: '',
    };
  }

  onSubmit = (event) => {
    const { value } = this.state;

    this.setState({ organization: value });

    event.preventDefault();
  }

  onChange = (value) => {
    this.setState({ value });
  }

  render() {
    const { value, organization } = this.state;

    return (
      <Router>
        <div>
          <Navigation
            value={value}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
          />

          <hr/>

          <Route
            exact path={routes.HOME}
            component={() => <OrganizationPage
                organization={organization}
            />}
          />
          <Route
            exact path={routes.PROFILE}
            component={() => <ProfilePage />}
          />
        </div>
      </Router>
    );
  }
}

export default App;