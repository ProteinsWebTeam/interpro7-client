import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';

import {closeSideNav} from 'actions/creators';

import style from './style.css';

const setRootGrayscale = (() => {
  let root;
  const GRAY_SCALE = 25;
  return isGray => {
    if (!root) {
      root = document.getElementById('root');
    }
    root.style.filter = `grayscale(${isGray ? GRAY_SCALE : 0}%)`;
  };
})();

const SideMenu = ({sideNav: visible, position = 'left', closeSideNav}) => {
  const left = position === 'left';
  setRootGrayscale(visible);
  return (
    <div onClick={closeSideNav}>
      <aside
        className={left ? style.left_container : style.right_container}
        style={{transform: visible ? 'translateX(0)' : ''}}
        role="menu"
        aria-hidden={!visible}
      >
        <ul>Menu
          <li><a href="#">menu content</a></li>
        </ul>
      </aside>
      <div
        className={visible ? style.overlay_visible : style.overlay_hidden}
      />
    </div>
  );
};
SideMenu.propTypes = {
  sideNav: T.bool.isRequired,
  position: T.oneOf(['left', 'right']),
  closeSideNav: T.func.isRequired,
};

export default connect(
  ({ui: {sideNav}}) => ({sideNav}),
  {closeSideNav}
)(SideMenu);
