import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';

import {foundationPartial} from 'styles/foundation';
import localStyles from './style.css';
const s = foundationPartial(localStyles);

const ToastDisplay = ({toasts}) => (
  <ul className={s('toast-display')}>
    {Object.entries(toasts).map(
      ([id, {className = '', title, body}]) => (
        <li key={id} className={s('callout', 'toast', className || 'primary')}>
          {title && <strong>{title}</strong>}
          <p>{body}</p>
        </li>
      )
    )}
  </ul>
);
ToastDisplay.propTypes = {
  toasts: T.object.isRequired,
};

export default connect(({toasts}) => ({toasts}))(ToastDisplay);
