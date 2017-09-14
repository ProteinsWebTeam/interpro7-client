import React, { PureComponent, Children, cloneElement } from 'react';
import T from 'prop-types';

const ro = new window.ResizeObserver(roEntries => {
  console.log('observer triggered');
  for (const { target, contentRect } of roEntries) {
    console.log('target', target);
    console.log('contentRect', contentRect);
  }
});

/*:: type Props = {
  element: ?string
  children: Element,
}; */

class _ResizeObserver extends PureComponent /*:: <Props> */ {
  /*:: _node: ?HTMLElement; */
  static defaultProps = {
    element: 'div',
  };

  static propTypes = {
    element: T.string,
  };

  componentDidMount() {
    ro.observe(this._node);
  }

  componentWillUnmount() {
    ro.unobserve(this._node);
  }

  _setRef = node => (this._node = node);

  render() {
    const { children, element: Element, ...props } = this.props;
    const child = Children.only(children);
    return (
      <Element {...props} ref={this._setRef} style={{ maxWidth: '640px' }}>
        {cloneElement(child)}
      </Element>
    );
  }
}

export default _ResizeObserver;
