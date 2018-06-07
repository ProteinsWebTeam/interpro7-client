// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
/*:: import type { Node } from 'react'; */

import ResizeObserver from './ResizeObserver';

/*:: type Measurement =
  'bottom' | 'height' | 'left' | 'right' | 'top' | 'width' | 'x' | 'y';
*/

/*:: type State = {
  [Measurement]: number,
}; */

/*:: type Props = {
  element: ?string,
  children: State => Node,
  measurements: Measurement | Array<Measurement>,
}; */

class ResizeObserverComponent extends PureComponent /*:: <Props, State> */ {
  /*::
    _ref: { current: null | React$ElementRef<string> };
    _resizeObserver: any;
  */

  static propTypes = {
    element: T.string,
    children: T.func.isRequired,
    measurements: T.oneOfType([T.arrayOf(T.string).isRequired, T.string]),
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = {};
    this._resizeObserver = new ResizeObserver(
      this._handleResizeEvent.bind(this),
    );

    this._ref = React.createRef();
  }

  componentDidMount() {
    this._resizeObserver.observe(this._ref.current);
  }

  componentWillUnmount() {
    this._resizeObserver.unobserve(this._ref.current);
  }

  _handleResizeEvent(resizeObserverEntries) {
    let finalContentRect;
    for (const { target, contentRect } of resizeObserverEntries) {
      if (target !== this._ref.current) continue; // shouldn't happen, but still
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

  render() {
    const { children, element, measurements, ...props } = this.props;
    const Element = element || 'div';
    return (
      // $FlowIgnore
      <Element {...props} ref={this._ref}>
        {children(this.state)}
      </Element>
    );
  }
}

export default ResizeObserverComponent;
