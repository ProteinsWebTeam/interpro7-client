import React, {PropTypes as T, Component} from 'react';
import {connect} from 'react-redux';

import {removeToast} from 'actions/creators';

import Toast from 'components/Toast/Toast';

import styles from './style.css';

const ToastDisplay = class extends Component {
  static propTypes = {
    toasts: T.object.isRequired,
    removeToast: T.func.isRequired,
  };

  constructor() {
    super();
    this.state = {over: false};
  }

  componentWillReceiveProps({toasts}) {
    // If no toast, the mouse can't be over
    if (!Object.keys(toasts).length) this.setState({over: false});
  }

  componentDidUpdate() {
    if (!this._lastMousePos) return;// No need to check, no previous mouse pos.
    if (!this.state.over) return;// No need to check, already outside

    const {x, y} = this._lastMousePos;
    this._lastMousePos = null;// Resets the value, to avoid infinite loop
    const {top, right, bottom, left} = this.container.getBoundingClientRect();
    // Detects if outside of the boundaries of the toast container
    if (x < left || x > right || y < top || y > bottom) {
      // Yes, I know what I'm doing
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({over: false});
    }
  }

  _handleMouseEnter = () => this.setState({over: true});

  _handleMouseLeave = () => this.setState({over: false});

  _handleClose = (toastId, {clientX: x, clientY: y} = {}) => {
    this.props.removeToast(toastId);
    // Stores last known mouse position to know if mouse still overing a toast
    if (x) this._lastMousePos = {x, y};
  };

  render() {
    const {toasts} = this.props;
    const {over} = this.state;
    return (
      <ul
        className={styles['toast-display']}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
        ref={container => this.container = container}
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
};

export default connect(({toasts}) => ({toasts}), {removeToast})(ToastDisplay);
