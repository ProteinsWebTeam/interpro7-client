// @flow
import React, {Component} from 'react';
import T from 'prop-types';

const DEFAULT_ITEM_DELAY = 25;
const DEFAULT_DURATION = 250;

export default class AnimatedEntry extends Component {
  /* ::
    _node: ?Element
    _animations: ?Array<any>
  */
  static propTypes = {
    element: T.oneOfType([
      T.string,
      T.element,
    ]),
    keyframes: T.oneOfType([
      T.array,
      T.object,
    ]),
    delay: T.number,
    itemDelay: T.number,
    duration: T.number,
    animateSelf: T.bool,
  };

  static defaultProps = {
    element: 'ul',
    keyframes: {opacity: [0, 1]},
    delay: 0,
    itemDelay: DEFAULT_ITEM_DELAY,
    duration: DEFAULT_DURATION,
    animateSelf: false,
  };

  componentDidMount() {
    if (!this._node || !this._node.animate) return;
    const {keyframes, delay, itemDelay, duration, animateSelf} = this.props;
    const toAnimate = Array.from(
      animateSelf ? [this._node] : this._node.children
    );
    this._animations = toAnimate.map((element/*: any */, i) => element.animate(
      keyframes,
      {
        duration,
        delay: delay + itemDelay * (i + 1),
        easing: 'ease-in-out',
        fill: 'both',
      },
    ));
  }

  componentWillUnmount() {
    for (const animation of this._animations || []) {
      if (animation.playState !== 'finished') animation.cancel();
    }
  }

  render() {
    const {
      element: Element,
      // remove those in next line from props passed
      keyframes, delay, itemDelay, duration, animateSelf,
      ...props
    } = this.props;
    return <Element ref={node => this._node = node} {...props} />;
  }
}
