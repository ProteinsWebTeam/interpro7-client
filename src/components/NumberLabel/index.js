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

export const DEFAULT_DURATION = 1;

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

const numberToDisplayText = (value, abbr) => {
  let _value = Math.round(value);
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
    title: T.oneOfType([T.string, T.number]),
  };

  static defaultProps = {
    duration: DEFAULT_DURATION,
    abbr: false,
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

    const canAnimate =
      !this.props.lowGraphics &&
      from !== to &&
      Number.isFinite(from) &&
      Number.isFinite(to);

    if (!canAnimate && this._ref.current) {
      this._ref.current.textContent = numberToDisplayText(to, this.props.abbr);
      return;
    }

    const animatable = { value: from };
    const duration =
      this.props.duration + (Math.random() - 1 / 2) * DELAY_RANGE;
    this._animation = TweenLite.to(animatable, duration, {
      value: to,
      delay: Math.random() * this.props.duration * DELAY_RANGE,
      onUpdate: () => {
        if (!this._ref.current) return;
        this._ref.current.textContent = numberToDisplayText(
          animatable.value,
          this.props.abbr,
        );
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
        title={_title || ''}
        ref={this._ref}
        {...props}
      />
    );
  }

  // render() {
  //   const {
  //     value,
  //     loading,
  //     duration,
  //     lowGraphics,
  //     className,
  //     dispatch,
  //     abbr,
  //     title,
  //     ...props
  //   } = this.props;
  //   let { value: _value } = this.state;
  //   if (isNaN(_value)) _value = 'N/A';
  //   if (Number.isFinite(_value)) {
  //     if (abbr) {
  //       _value = getAbbr(_value);
  //     } else {
  //       // this will print the number according to locale preference
  //       // like a coma as thousand-separator in english
  //       if (Number.isFinite(_value)) _value = _value.toLocaleString();
  //     }
  //   }
  //   let _title = title;
  //   if (!_title && abbr) {
  //     const potentialTitle =
  //       (this.props.value && this.props.value.toLocaleString()) || '0';
  //     // Should only happen if value has been shortened
  //     if (potentialTitle !== _value) _title = potentialTitle;
  //   }
  //   return (
  //     <span
  //       className={f(className, { loading, lowGraphics })}
  //       title={_title || ''}
  //       {...props}
  //     >
  //       {_value}
  //     </span>
  //   );
  // }
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
