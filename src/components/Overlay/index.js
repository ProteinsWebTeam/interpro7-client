// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import classnames from 'classnames/bind';

import { closeEverything } from 'actions/creators';
import { emblMapNavSelector } from 'reducers/ui/emblMapNav';
import { sideNavSelector } from 'reducers/ui/sideNav';

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
      <div
        aria-hidden="true"
        className={s('overlay', { visible })}
        onClick={closeEverything}
        onKeyPress={closeEverything}
      />
    );
  }
}

const mapStateToProps = createSelector(
  emblMapNavSelector,
  sideNavSelector,
  (emblMapNav, sideNav) => ({ visible: sideNav || emblMapNav }),
);

export default connect(mapStateToProps, { closeEverything })(Overlay);
