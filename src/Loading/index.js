import React, { Component } from 'react';

import './style.css';

const TICK_RATE = 500;

class Loading extends Component {
  state = {
    dots: 0,
  };

  componentDidMount() {
    this.interval = setInterval(this.onTick, TICK_RATE);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onTick = () => {
    this.setState(prevState => ({ dots: (prevState.dots + 1) % 4 }));
  };

  render() {
    const { isCenter } = this.props;
    const { dots } = this.state;

    const classNames = ['Loading'];

    if (isCenter) {
      classNames.push('Loading_center');
    }

    return (
      <div className={classNames.join(' ')}>
        <small>
          Loading {new Array(dots).fill(0).map(dot => '.')}
        </small>
      </div>
    );
  }
}

export default Loading;
