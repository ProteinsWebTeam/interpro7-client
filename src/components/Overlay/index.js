// @flow
import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames/bind';

import {closeEverything} from 'actions/creators';

import styles from './style.css';

const s = classnames.bind(styles);

const Overlay = ({visible, closeEverything}) => (
  <div onClick={closeEverything} className={s('overlay', {visible})} />
);
Overlay.propTypes = {
  visible: T.bool.isRequired,
  closeEverything: T.func.isRequired,
};

export default connect(
  // selector
  ({ui: {sideNav, emblMapNav}}) => ({visible: sideNav || emblMapNav}),
  // action creator
  {closeEverything}
)(Overlay);
