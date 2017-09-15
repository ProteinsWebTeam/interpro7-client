import React, { PureComponent, Children, cloneElement } from 'react';
import T from 'prop-types';

import ResizeObserver from './ResizeObserver';

//:: type measurement = 'bottom' | 'height' | 'left' | 'right' | 'top' | 'width' | 'x' | 'y';

/*:: type Props = {
  element: ?string,
  children: Element,
  measurements: Measurement | Array<Measurement>,
}; */

class ResizeObserverComponent extends PureComponent /*:: <Props> */ {
  /*::
    _node: ?HTMLElement;
    _resizeObserver: any;
  */
  static defaultProps = {
    element: 'div',
  };

  static propTypes = {
    element: T.string,
    children: T.any,
    measurements: T.oneOfType([T.arrayOf(T.string).isRequired, T.string]),
  };

  constructor(props) {
    super(props);
    this.state = {};
    this._resizeObserver = new ResizeObserver(
      this._handleResizeEvent.bind(this)
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
    const { children, element: Element, measurements, ...props } = this.props;
    const child = Children.only(children);
    return (
      <Element {...props} ref={this._setRef}>
        {cloneElement(child, this.state)}
      </Element>
    );
  }
}

export default ResizeObserverComponent;
