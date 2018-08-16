// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import TA from 'timeago.js';
import { sleep, schedule } from 'timing-functions/src';

import random from 'utils/random';

let timeago;
const ONE_MINUTE = 60000;

/*:: type Props = {
  date: Date,
  title?: string,
  noTitle?: boolean,
  noUpdate?: boolean,
};*/

class TimeAgo extends PureComponent /*:: <Props> */ {
  /* ::
    _ref: { current: HTMLElement | null };
    _delay: () => number;
    __delay: number;
  */
  static propTypes = {
    date: T.instanceOf(Date).isRequired,
    title: T.string,
    noTitle: T.bool,
    noUpdate: T.bool,
  };

  constructor(props /*: Props */) {
    super(props);

    // Only create one instance, and only when it is needed
    if (!timeago) timeago = new TA();

    this._ref = React.createRef();
  }

  async componentDidMount() {
    if (this.props.noUpdate) return;
    await sleep(this._delay);
    await schedule();
    // infinite loop while mounted
    while (this._ref.current) {
      // $FlowIgnore
      this._ref.current.textContent = timeago.format(this.props.date);
      await sleep(this._delay);
      await schedule();
    }
  }

  // delay before re-rendering will slowly grow everytime by up to 1 minute
  get _delay() {
    this.__delay = (this.__delay || 0) + random(0, ONE_MINUTE);
    return this.__delay;
  }

  render() {
    const { date, title, noTitle } = this.props;
    let _title;
    if (!noTitle) {
      _title = title || date.toLocaleString();
    }
    return (
      <time dateTime={date.toISOString()} title={_title} ref={this._ref}>
        {timeago.format(date)}
      </time>
    );
  }
}

export default TimeAgo;
