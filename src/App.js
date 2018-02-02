import React, { Component } from 'react';

import Organization from './Organization';
import './App.css';

const ORGANIZATION_DEFAULT = 'the-road-to-learn-react';

class App extends Component {
  constructor() {
    super();

    this.state = {
      search: ORGANIZATION_DEFAULT,
      organization: ORGANIZATION_DEFAULT,
      // organization: '',
    };
  }

  onSubmit = (event) => {
    const { search } = this.state;

    this.setState({ organization: search });

    event.preventDefault();
  }

  render() {
    const { search, organization } = this.state;

    return (
      <div className="App">
        <div className="App-content">
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              value={search}
              onChange={e => this.setState({ search: e.target.value })}
            />
            <button type="submit">Send</button>
          </form>

          <Organization organization={organization} />
        </div>
      </div>
    );
  }
}

export default App;