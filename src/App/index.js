import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import HomePage from '../Home';
import ProfilePage from '../Profile';

import * as routes from '../constants/routes';

const App = () =>
  <Router>
    <div>
      <Navigation />

      <hr/>

      <Route
        exact path={routes.HOME}
        component={() => <HomePage />}
      />
      <Route
        exact path={routes.PROFILE}
        component={() => <ProfilePage />}
      />
    </div>
  </Router>

const Navigation = () =>
  <div>
    <ul>
      <li><Link to={routes.HOME}>Home</Link></li>
      <li><Link to={routes.PROFILE}>Profile</Link></li>
    </ul>
  </div>

export default App;