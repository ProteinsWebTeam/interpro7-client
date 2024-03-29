import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

const DEFAULT_ITEM_DELAY = 25;
const DEFAULT_DURATION = 250;

/*:: type Props = {
  element: HTMLElement | string,
  keyframes: ?Array<Object> | Object,
  delay: number,
  itemDelay: number,
  duration: number,
  animateSelf: boolean,
  lowGraphics: boolean,
  dispatch: function,
} */

export class AnimatedEntry extends PureComponent /*:: <Props> */ {
  /*::
    _ref: { current: null | React$ElementRef<'div'> };
    _animations: ?Array<any>;
  */
  static propTypes = {
    element: T.oneOfType([T.string, T.element]),
    keyframes: T.oneOfType([T.array, T.object]),
    delay: T.number,
    itemDelay: T.number,
    duration: T.number,
    animateSelf: T.bool,
    lowGraphics: T.bool.isRequired,
    dispatch: T.func,
    className: T.string,
    children: T.any,
  };

  static defaultProps = {
    element: 'ul',
    keyframes: { opacity: [0, 1] },
    delay: 0,
    itemDelay: DEFAULT_ITEM_DELAY,
    duration: DEFAULT_DURATION,
    animateSelf: false,
  };

  constructor(props /*: Props */) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    if (
      this.props.lowGraphics ||
      !this._ref.current ||
      !this._ref.current.animate
    )
      return;
    const { keyframes, delay, itemDelay, duration, animateSelf } = this.props;
    const toAnimate = Array.from(
      animateSelf ? [this._ref.current] : this._ref.current.children,
    );
    this._animations = toAnimate.map((element /*: any */, i) =>
      element.animate(keyframes, {
        duration,
        delay: delay + itemDelay * (i + 1),
        easing: 'ease-in-out',
        fill: 'both',
      }),
    );
  }

  componentWillUnmount() {
    for (const animation of this._animations || []) {
      if (animation.playState !== 'finished') animation.cancel();
    }
  }

  render() {
    const {
      element: Element,
      // remove those in next lines from props passed
      keyframes,
      delay,
      itemDelay,
      duration,
      animateSelf,
      lowGraphics,
      dispatch,
      ...props
    } = this.props;
    return <Element {...props} ref={this._ref} />;
  }
}

const mapStateToProps = createSelector(
  (state) => state.settings.ui.lowGraphics,
  (lowGraphics) => ({ lowGraphics }),
);

export default connect(mapStateToProps, undefined)(AnimatedEntry);
