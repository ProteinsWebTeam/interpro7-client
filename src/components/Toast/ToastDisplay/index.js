import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { removeToast } from 'actions/creators';

import Toast from 'components/Toast/Toast';

import styles from './style.css';

class ToastDisplay extends PureComponent {
  static propTypes = {
    toasts: T.object.isRequired,
    removeToast: T.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { over: false };

    this._ref = React.createRef();
  }

  static getDerivedStateFromProps({ toasts }) {
    if (Object.keys(toasts).length) return null;
    // If no toast, the mouse can't be over
    return { over: false };
  }

  componentDidUpdate() {
    if (!this._lastMousePos) return; // No need to check, no previous mouse pos.
    if (!this.state.over) return; // No need to check, already outside

    const { x, y } = this._lastMousePos;
    this._lastMousePos = null; // Resets the value, to avoid infinite loop
    const {
      top,
      right,
      bottom,
      left,
    } = this._ref.current.getBoundingClientRect();
    // Detects if outside of the boundaries of the toast container
    if (x < left || x > right || y < top || y > bottom) {
      // Yes, I know what I'm doing
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ over: false });
    }
  }

  _handleMouseEnter = () => this.setState({ over: true });

  _handleMouseLeave = () => this.setState({ over: false });

  _handleClose = (toastId, { clientX: x, clientY: y } = {}) => {
    this.props.removeToast(toastId);
    // Stores last known mouse position to know if mouse still overing a toast
    if (x) this._lastMousePos = { x, y };
  };

  render() {
    const { toasts } = this.props;
    const { over } = this.state;
    return (
      <ul
        className={styles['toast-display']}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
        ref={this._ref}
      >
        {Object.entries(toasts).map(([id, toast]) => (
          <Toast
            key={id}
            toastId={id}
            paused={over}
            handleClose={this._handleClose}
            {...toast}
          />
        ))}
      </ul>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.toasts,
  toasts => ({ toasts }),
);

export default connect(
  mapStateToProps,
  { removeToast },
)(ToastDisplay);
