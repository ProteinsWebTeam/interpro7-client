// @flow
import React, { Component } from 'react';
import T from 'prop-types';

import styles from './style.css';
import _DOMAttributeChecker from 'higherOrder/DOMAttributeChecker';

const Content = ({
  clientWidth,
  clientHeight,
  scrollWidth,
  scrollHeight,
  isOverflowing,
  children,
}) => {
  isOverflowing(scrollHeight > clientHeight || scrollWidth > clientWidth);
  return <div>{children}</div>;
};
Content.propTypes = {
  clientWidth: T.number,
  scrollWidth: T.number,
  scrollHeight: T.number,
  clientHeight: T.number,
  isOverflowing: T.func,
  children: T.node,
};

const Wrapped = _DOMAttributeChecker(
  'clientWidth',
  'clientHeight',
  'scrollWidth',
  'scrollHeight',
)(Content);

class ReadMoreCard extends Component {
  static propTypes = {
    children: T.node,
  };

  state = {
    collapsed: true,
    displayButton: true,
  };

  toggleCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };
  setVisibility = visibility => {
    if (visibility === this.state.displayButton && this.state.collapsed) {
      this.setState({ displayButton: !visibility });
    }
  };

  render() {
    const { collapsed, displayButton } = this.state;
    const { children } = this.props;
    return (
      <div className={collapsed ? styles.collapsed : styles.opened}>
        <Wrapped isOverflowing={this.setVisibility}>{children}</Wrapped>
        <button
          onClick={this.toggleCollapse}
          className={displayButton ? styles.hidden : ''}
        >
          ▼
        </button>
      </div>
    );
  }
}

export default ReadMoreCard;
