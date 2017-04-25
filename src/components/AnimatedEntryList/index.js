// @flow
import React, {Component} from 'react';
import T from 'prop-types';

const DEFAULT_ITEM_DELAY = 25;
const DEFAULT_DURATION = 250;

export default class extends Component {
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
  };

  static defaultProps = {
    element: 'ul',
    keyframes: {opacity: [0, 1]},
    delay: 0,
    itemDelay: DEFAULT_ITEM_DELAY,
    duration: DEFAULT_DURATION,
  };

  componentDidMount() {
    if (!(this._node && this._node.animate)) return;
    const {keyframes, delay, itemDelay, duration} = this.props;
    this._animations = Array.from(
      this._node.children
    ).map((child/*: any */, i) => child.animate(
      {keyframes},
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
      keyframes, delay, itemDelay, duration, // remove those from props passed
      ...props
    } = this.props;
    return <Element ref={node => this._node = node} {...props} />;
  }
}
