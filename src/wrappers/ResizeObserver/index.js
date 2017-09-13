import { PureComponent, Children, cloneElement } from 'react';

/*:: type Props = {
  children: Element,
}; */

class ResizeObserver extends PureComponent /*:: <Props> */ {
  /*:: _node: ?HTMLElement; */
  _setRef = node => (this._node = node);

  render() {
    const child = Children.only(this.props.children);
    return cloneElement(child, { ref: this._setRef });
  }
}

export default ResizeObserver;
