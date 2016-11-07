import React, {PropTypes as T} from 'react';
import {Link} from 'react-router';

import {BaseLink} from 'components/ExtLink';

import styles from './style.css';

const isExternal = ([first, second]) => (
  // 'http://www.example.com'
  //  ↑
  first.toLowerCase() === 'h' ||
  // '//www.example.com'
  //   ↑
  second === '/'
);

const MenuItem = ({children, to, disabled = false, className, ...props}) => {
  const CustomLink = isExternal(to) ? BaseLink : Link;
  return (
    <CustomLink
      to={to}
      className={
        disabled ?
        `${className || ''} ${styles.disabled}`.trim() :
        className
      }
      {...(
        disabled ?
        {disabled: true, tabIndex: '-1', 'aria-disabled': 'true'} :
        {}
      )}
      {...props}
    >
      {children}
    </CustomLink>);
};
MenuItem.propTypes = {
  children: T.node.isRequired,
  to: T.string.isRequired,
  className: T.string,
  disabled: T.bool,
};

export default MenuItem;
