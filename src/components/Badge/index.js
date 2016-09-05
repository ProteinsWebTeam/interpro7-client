/* @flow */
import React, {PropTypes as T} from 'react';

import style from './style.css';

const Badge = (
  {children, title}/*: {children?: string | number, title?: string} */
) => (
  <span className={style.badge} title={title || children}>
    {children}
  </span>
);
Badge.propTypes = {
  children: T.oneOfType([T.string, T.number]).isRequired,
  title: T.string,
};

export default Badge;
