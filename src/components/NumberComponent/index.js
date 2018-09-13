import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { TweenLite, Power2 } from 'gsap/all';

import random from 'utils/random';
import numberToDisplayText from './utils/number-to-display-text';

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

/*:: type ComponentProps = {
  children: ?(number | string),
  loading?: boolean,
  noAnimation?: boolean,
  duration: number,
  className: ?string,
  lowGraphics: boolean,
  dispatch: function,
  abbr: boolean,
  label?: boolean,
  scaleMargin: number,
  noTitle: ?boolean,
  title?: number | string,
  titleType?: string,
}; */

class NumberComponent extends PureComponent /*:: <ComponentProps> */ {
  /*::
    _ref: { current: HTMLSpanElement | null };
    _animation: ?any;
  */

  static propTypes = {
    children: T.oneOfType([T.number, T.string]),
    loading: T.bool,
    noAnimation: T.bool,
    duration: T.number,
    className: T.string,
    lowGraphics: T.bool.isRequired,
    dispatch: T.func.isRequired,
    abbr: T.bool,
    label: T.bool,
    scaleMargin: T.number,
    noTitle: T.bool,
    title: T.oneOfType([T.string, T.number]),
    titleType: T.string,
  };

  static defaultProps = {
    duration: DEFAULT_DURATION,
    abbr: false,
    scaleMargin: UNIT_SCALE_MARGIN,
  };

  constructor(props /*: ComponentProps */) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    this._animate(this.props.children);
  }

  componentDidUpdate({ children: from }) {
    this._animate(this.props.children, from);
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

    if (
      !this.props.noTitle &&
      !this.props.title &&
      finalValue &&
      this._ref.current !== null
    ) {
      this._ref.current.title = `Approximately ${finalValue} ${this.props
        .titleType || ''}`.trim();
    }

    const canAnimate =
      !this.props.noAnimation &&
      !this.props.lowGraphics &&
      from !== to &&
      Number.isFinite(from) &&
      Number.isFinite(to);

    if (!canAnimate) {
      if (this._ref.current) {
        this._ref.current.textContent = `${finalValue || ''}`;
      }
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
        this._ref.current.textContent = `${numberToDisplayText(
          animatable.value,
          this.props.abbr,
          this.props.scaleMargin,
        ) || ''}`;
      },
      ease: Power2.easeIn,
    });
  };

  render() {
    const {
      children,
      loading,
      noAnimation,
      duration,
      lowGraphics,
      className,
      dispatch,
      abbr,
      noTitle,
      title,
      titleType,
      label,
      scaleMargin,
      ...props
    } = this.props;

    return (
      <span
        className={f(className, { loading, lowGraphics, label })}
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

export default connect(mapStateToProps)(NumberComponent);
