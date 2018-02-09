// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import ResizeObserver from './ResizeObserver';

/*:: type Measurement =
  'bottom' | 'height' | 'left' | 'right' | 'top' | 'width' | 'x' | 'y';
*/

/*:: type Props = {
  element: ?string,
  children: Element,
  measurements: Measurement | Array<Measurement>,
}; */

/*:: type State = {} | {|
  [key: Measurement]: number,
|}; */

class ResizeObserverComponent extends PureComponent /*:: <Props, State> */ {
  /*::
    _node: ?HTMLElement;
    _resizeObserver: any;
  */

  static propTypes = {
    element: T.string,
    children: T.any.isRequired,
    measurements: T.oneOfType([T.arrayOf(T.string).isRequired, T.string]),
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = {};
    this._resizeObserver = new ResizeObserver(
      this._handleResizeEvent.bind(this),
    );
  }

  componentDidMount() {
    this._resizeObserver.observe(this._node);
  }

  componentWillUnmount() {
    this._resizeObserver.unobserve(this._node);
  }

  _handleResizeEvent(resizeObserverEntries) {
    let finalContentRect;
    for (const { target, contentRect } of resizeObserverEntries) {
      if (target !== this._node) continue; // shouldn't happen, but still
      finalContentRect = contentRect;
    }
    if (finalContentRect) {
      const state = {};
      let { measurements } = this.props;
      if (!Array.isArray(measurements)) {
        measurements = [measurements];
      }
      for (const measurement of measurements) {
        state[measurement] = finalContentRect[measurement];
      }
      this.setState(state);
    }
  }

  _setRef = node => {
    if (node instanceof HTMLElement) this._node = node;
  };

  render() {
    const { children, element, measurements, ...props } = this.props;
    const Element = element || 'div';
    return (
      <Element {...props} ref={this._setRef}>
        {children(this.state)}
      </Element>
    );
  }
}

export default ResizeObserverComponent;
