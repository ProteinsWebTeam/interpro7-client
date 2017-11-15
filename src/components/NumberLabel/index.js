// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import TweenLite from 'gsap/TweenLite';

import { foundationPartial } from 'styles/foundation';
import style from './style.css';

const f = foundationPartial(style);

// Avoid doing too much work
// This is to update a number value, not style, so no need re-render every frame
const MAX_FPS = 10;
TweenLite.ticker.fps(MAX_FPS);

const DELAY_RANGE = 0.1;

class NumberLabel extends PureComponent {
  static propTypes = {
    value: T.number,
    duration: T.number,
    className: T.string,
    lowGraphics: T.bool.isRequired,
    dispatch: T.func.isRequired,
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

  componentWillUnmount() {
    if (this._animation) {
      this._animation.kill();
      this._animation = null;
    }
  }

  _animate = (from, to) => {
    if (this._animation) this._animation.kill();
    const canAnimate =
      !this.props.lowGraphics &&
      from !== to &&
      Number.isFinite(from) &&
      Number.isFinite(to);
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
    const {
      value,
      duration,
      lowGraphics,
      className,
      dispatch,
      ...props
    } = this.props;
    let { value: _value } = this.state;
    if (isNaN(_value)) _value = 'N/A';
    // this will print the number according to locale preference
    // like a coma as thousand-separator in english
    if (Number.isFinite(_value)) _value = _value.toLocaleString();
    return (
      <span className={f('label', className, { lowGraphics })} {...props}>
        {_value}
      </span>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.ui.lowGraphics,
  lowGraphics => ({ lowGraphics }),
);

export default connect(mapStateToProps)(NumberLabel);
