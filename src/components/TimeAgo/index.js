// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import TA from 'timeago.js';
import { sleep, schedule } from 'timing-functions/src';

let timeago;
const ONE_MINUTE = 60000;

class TimeAgo extends PureComponent {
  static propTypes = {
    date: T.instanceOf(Date).isRequired,
  };

  constructor(props) {
    super(props);
    // Only create one instance, and only when it is needed
    if (!timeago) timeago = new TA();
  }

  // delay before re-rendering will slowly grow everytime by up to 1 minute
  get _delay() {
    this.__delay = (this.__delay || 0) + ONE_MINUTE * Math.random();
    return this.__delay;
  }

  async componentDidMount() {
    this._mounted = true;
    await sleep(this._delay);
    await schedule();
    // infinite loop while mounted
    while (this._mounted) {
      this.forceUpdate();
      await sleep(this._delay);
      await schedule();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    return timeago.format(this.props.date);
  }
}

export default TimeAgo;
