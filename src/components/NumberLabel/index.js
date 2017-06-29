import React, { Component } from 'react';
import T from 'prop-types';
import TweenLite from 'gsap/TweenLite';

import { foundationPartial } from 'styles/foundation';
import style from './style.css';

const f = foundationPartial(style);

// Avoid doing too much work
// This is to update a number value, not style, so no need re-render every frame
const MAX_FPS = 10;
TweenLite.ticker.fps(MAX_FPS);

const DELAY_RANGE = 0.1;

class NumberLabel extends Component {
  static propTypes = {
    value: T.number,
    duration: T.number,
    className: T.string,
  };

  static defaultProps = {
    duration: 1,
  };

  constructor(props /*: ?any */) {
    super(props);
    this.state = { value: 0 };
  }

  componentWillMount() {
    this._animate(this.state.value, this.props.value);
  }

  componentWillReceiveProps({ value }) {
    this._animate(this.state.value, value);
  }

  _animate = (from, to) => {
    if (this._animation) this._animation.kill();
    const canAnimate =
      from !== to && Number.isFinite(from) && Number.isFinite(to);
    if (!canAnimate) return this.setState({ value: to });

    const animatable = { value: this.state.value };
    this._animation = TweenLite.to(animatable, this.props.duration, {
      value: to,
      // between 0 and 10% of full duration
      delay: Math.random() * this.props.duration * DELAY_RANGE,
      onUpdate: () => this.setState({ value: Math.round(animatable.value) }),
    });
  };

  render() {
    const { value: _, duration: __, className, ...props } = this.props;
    let { value: _value } = this.state;
    if (isNaN(_value)) _value = 'N/A';
    if (Number.isFinite(_value)) _value = _value.toLocaleString();
    return (
      <span className={f('label', className)} {...props}>
        {_value}
      </span>
    );
  }
}

export default NumberLabel;
