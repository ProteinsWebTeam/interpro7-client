import React, { PureComponent, RefObject } from 'react';
import { format } from 'timeago.js';
import { sleep, schedule } from 'timing-functions';
import { formatShortDate, formatLongDateTime } from 'utils/date';

import random from 'utils/random';

const ONE_MINUTE = 60000;

type Props = {
  date: Date;
  title?: string;
  noTitle?: boolean;
  noUpdate?: boolean;
};

class TimeAgo extends PureComponent<Props> {
  _ref: RefObject<HTMLTimeElement>;
  #delay = 0;

  constructor(props: Props) {
    super(props);
    this._ref = React.createRef();
  }

  async componentDidMount() {
    if (this.props.noUpdate) return;
    await sleep(this._delay);
    await schedule();
    // infinite loop while mounted
    while (this._ref.current) {
      // $FlowIgnore
      this._ref.current.textContent = format(this.props.date);
      await sleep(this._delay);
      await schedule();
    }
  }

  // delay before re-rendering will slowly grow everytime by up to 1 minute
  get _delay() {
    this.#delay = (this.#delay || 0) + random(0, ONE_MINUTE);
    return this.#delay;
  }

  render() {
    const { date, title, noTitle } = this.props;
    let _title;
    if (!noTitle) {
      _title = title || formatShortDate(date);
    }
    return (
      <time dateTime={formatLongDateTime(date)} title={_title} ref={this._ref}>
        {format(date)}
      </time>
    );
  }
}

export default TimeAgo;
