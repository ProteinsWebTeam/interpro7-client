// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import classnames from 'classnames/bind';

import { closeEverything } from 'actions/creators';

import styles from './style.css';

const s = classnames.bind(styles);

/*:: type Props = {
  visible: boolean,
  closeEverything: function,
} */

export class Overlay extends PureComponent /*:: <Props> */ {
  static propTypes = {
    visible: T.bool.isRequired,
    closeEverything: T.func.isRequired,
  };

  render() {
    const { closeEverything, visible } = this.props;
    return (
      <div onClick={closeEverything} className={s('overlay', { visible })} />
    );
  }
}

const mapStateToProps = createSelector(
  state => state.ui.sideNav,
  state => state.ui.emblMapNav,
  (sideNav, emblMapNav) => ({ visible: sideNav || emblMapNav }),
);

export default connect(mapStateToProps, { closeEverything })(Overlay);
