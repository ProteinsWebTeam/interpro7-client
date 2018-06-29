import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { TweenLite, Power2 } from 'gsap/all';

import random from 'utils/random';
import getAbbr from './utils/get-abbr';

import { foundationPartial } from 'styles/foundation';
import style from './style.css';

const f = foundationPartial(style);

const UNIT_SCALE_MARGIN = 1; // abbr at this level
// examples: (1: 1000 -> 1k) (10: 1000 -> 1000, 10000 -> 10k)

// Jump ahead if the animation didn't run because it wasn't visible
// We don't want transitions to stop and resume later
TweenLite.lagSmoothing(0);

export const DEFAULT_DURATION = 1;

const DELAY_RANGE = 0.25;

const numberToDisplayText = (value, abbr, scaleMargin) => {
  if (!value && value !== 0) return;
  let _value = Math.round(value);
  if (isNaN(_value)) _value = 'N/A';
  if (Number.isFinite(_value)) {
    if (abbr) {
      _value = getAbbr(_value, scaleMargin);
    } else {
      // this will print the number according to locale preference
      // like a coma as thousand-separator in english
      if (Number.isFinite(_value)) _value = _value.toLocaleString();
    }
  }
  return _value;
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
    scaleMargin: T.number,
    title: T.oneOfType([T.string, T.number]),
    titleType: T.string,
  };

  static defaultProps = {
    duration: DEFAULT_DURATION,
    abbr: false,
    scaleMargin: UNIT_SCALE_MARGIN,
  };

  constructor(props /*: ?any */) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    this._animate(this.props.value);
  }

  componentDidUpdate({ value: from }) {
    this._animate(this.props.value, from);
  }

  componentWillUnmount() {
    if (this._animation) {
      this._animation.kill();
      this._animation = null;
    }
  }

  _animate = (to, from = 0) => {
    if (this._animation) this._animation.kill();

    if (!this._ref.current) return;
    const finalValue = numberToDisplayText(
      to,
      this.props.abbr,
      this.props.scaleMargin,
    );

    if (!this.props.title) {
      this._ref.current.title = `Approximately ${finalValue} ${this.props
        .titleType || ''}`.trim();
    }

    const canAnimate =
      !this.props.lowGraphics &&
      from !== to &&
      Number.isFinite(from) &&
      Number.isFinite(to);

    if (!canAnimate) {
      this._ref.current.textContent = finalValue;
      return;
    }

    const animatable = { value: from };
    // eslint-disable-next-line no-magic-numbers
    const duration = this.props.duration + random(-0.5, 0.5) * DELAY_RANGE;
    this._animation = TweenLite.to(animatable, duration, {
      value: to,
      delay: random() * this.props.duration * DELAY_RANGE,
      onUpdate: () => {
        if (!this._ref.current) return;
        this._ref.current.textContent = numberToDisplayText(
          animatable.value,
          this.props.abbr,
          this.props.scaleMargin,
        );
      },
      ease: Power2.easeIn,
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
      titleType,
      scaleMargin,
      ...props
    } = this.props;

    let _title = title;
    if (!_title && abbr) {
      const potentialTitle =
        (this.props.value && this.props.value.toLocaleString()) || '0';
      // Should only happen if value has been shortened
      if (potentialTitle !== value) _title = potentialTitle;
    }
    return (
      <span
        className={f(className, { loading, lowGraphics })}
        ref={this._ref}
        {...props}
      />
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
