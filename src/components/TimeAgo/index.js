// @flow
import { PureComponent } from 'react';
import T from 'prop-types';
import TA from 'timeago.js';
import { sleep, schedule } from 'timing-functions/src';

import random from 'utils/random';

let timeago;
const ONE_MINUTE = 60000;

const mounted = new WeakSet();

/*:: type Props = {
  date: Date,
  noUpdate?: boolean,
};*/

class TimeAgo extends PureComponent /*:: <Props> */ {
  /* ::
    _delay: () => number;
    __delay: number;
  */
  static propTypes = {
    date: T.instanceOf(Date).isRequired,
    noUpdate: T.bool,
  };

  constructor(props /*: Props */) {
    super(props);
    // Only create one instance, and only when it is needed
    if (!timeago) timeago = new TA();
  }

  async componentDidMount() {
    mounted.add(this);
    if (this.props.noUpdate) return;
    await sleep(this._delay);
    await schedule();
    // infinite loop while mounted
    while (mounted.has(this)) {
      this.forceUpdate();
      await sleep(this._delay);
      await schedule();
    }
  }

  componentWillUnmount() {
    mounted.delete(this);
  }

  // delay before re-rendering will slowly grow everytime by up to 1 minute
  get _delay() {
    this.__delay = (this.__delay || 0) + random(0, ONE_MINUTE);
    return this.__delay;
  }

  render() {
    return timeago.format(this.props.date);
  }
}

export default TimeAgo;
