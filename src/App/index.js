import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Navigation from '../Navigation';
import OrganizationPage from '../Organization';
import ProfilePage from '../Profile';

import * as routes from '../constants/routes';

import './style.css';

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

          <Route
            exact path={routes.HOME}
            component={() =>
              <div className="App-content_large-header">
                <OrganizationPage
                  organization={organization}
                />
              </div>
            }
          />
          <Route
            exact path={routes.PROFILE}
            component={() =>
              <div className="App-content_small-header">
                <ProfilePage />
              </div>
            }
          />
        </div>
      </Router>
    );
  }
}

export default App;