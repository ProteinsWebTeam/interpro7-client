import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import debounce from 'lodash-es/debounce';

import TweenLite from 'gsap/TweenLite';

import { foundationPartial } from 'styles/foundation';
import style from './style.css';

const f = foundationPartial(style);

const UNITS = ['', 'k+', 'M+', 'G+'];
const UNIT_SCALE = 1000;
const UNIT_SCALE_MARGIN = 100;

// Jump ahead if the animation didn't run because it wasn't visible
// We don't want transitions to stop and resume later
TweenLite.lagSmoothing(0);

export const DEFAULT_DURATION = 0.75;

const DELAY_RANGE = 0.25;

const getAbbr = (value /*: number */) => {
  let _value = value;
  let unitIndex = 0;
  while (_value > UNIT_SCALE * UNIT_SCALE_MARGIN) {
    unitIndex++;
    _value = Math.floor(_value / UNIT_SCALE);
  }
  return `${_value.toLocaleString()}${UNITS[unitIndex]}`;
};

class _NumberComponent extends PureComponent {
  static propTypes = {
    value: T.oneOfType([T.number, T.string]),
    loading: T.bool,
    duration: T.number,
    className: T.string,
    lowGraphics: T.bool.isRequired,
    dispatch: T.func.isRequired,
    abbr: T.bool,
    title: T.oneOfType([T.string, T.number]),
  };

  static defaultProps = {
    duration: DEFAULT_DURATION,
    abbr: false,
  };

  constructor(props /*: ?any */) {
    super(props);

    this.state = { value: 0 };
  }

  componentDidMount() {
    this._animate();
  }

  componentDidUpdate() {
    this._animate();
  }

  componentWillUnmount() {
    if (this._animation) {
      this._animation.kill();
      this._animation = null;
    }
    if (this._onUpdate) {
      this._onUpdate.cancel();
      this._onUpdate = null;
    }
  }

  _animate = () => {
    const { value: from } = this.state;
    const { value: to } = this.props;
    if (this._animation) this._animation.kill();
    if (this._onUpdate) this._onUpdate.cancel();
    const canAnimate =
      !this.props.lowGraphics &&
      from !== to &&
      Number.isFinite(from) &&
      Number.isFinite(to);
    if (!canAnimate) return this.setState({ value: to });

    const animatable = { value: this.state.value };
    this._onUpdate = debounce(
      () => this.setState({ value: Math.round(animatable.value) }),
      16,
    );
    this._animation = TweenLite.to(animatable, this.props.duration, {
      value: to,
      // between 0 and 10% of full duration
      delay: Math.random() * this.props.duration * DELAY_RANGE,
      onUpdate: this._onUpdate,
      onComplete: () => {
        if (this._onUpdate()) this._onUpdate.flush();
      },
      ease: TweenLite.Power2.easeIn,
    });
  };

  render() {
    const {
      value,
      loading,
      duration,
      lowGraphics,
      className,
      dispatch,
      abbr,
      title,
      ...props
    } = this.props;
    let { value: _value } = this.state;
    if (isNaN(_value)) _value = 'N/A';
    if (Number.isFinite(_value)) {
      if (abbr) {
        _value = getAbbr(_value);
      } else {
        // this will print the number according to locale preference
        // like a coma as thousand-separator in english
        if (Number.isFinite(_value)) _value = _value.toLocaleString();
      }
    }
    let _title = title;
    if (!_title && abbr) {
      const potentialTitle =
        (this.props.value && this.props.value.toLocaleString()) || '0';
      // Should only happen if value has been shortened
      if (potentialTitle !== _value) _title = potentialTitle;
    }
    return (
      <span
        className={f(className, { loading, lowGraphics })}
        title={_title || ''}
        {...props}
      >
        {_value}
      </span>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.ui.lowGraphics,
  lowGraphics => ({ lowGraphics }),
);

export const NumberComponent = connect(mapStateToProps)(_NumberComponent);

class NumberLabel extends PureComponent {
  static propTypes = {
    className: T.string,
  };

  render() {
    const { className, ...props } = this.props;
    return <NumberComponent className={f('label', className)} {...props} />;
  }
}

export default NumberLabel;
