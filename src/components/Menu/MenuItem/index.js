import React from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';
import {connect} from 'react-redux';

import {BaseLink} from 'components/ExtLink';

import {closeEverything} from 'actions/creators';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import helperClasses from 'styles/helper-classes.css';
import styles from './style.css';

const s = foundationPartial(ebiStyles, helperClasses, styles);

const isExternal = ([first, second]) => (
  // 'http://www.example.com'
  //  ↑
  first.toLowerCase() === 'h' ||
  // '//www.example.com'
  //   ↑
  second === '/'
);

const MenuItem = (
  {
    children,
    to,
    disabled = false,
    active = false,
    className,
    closeEverything,
    ...props
  }
) => {
  const CustomLink = isExternal(to) ? BaseLink : Link;
  return (
    <CustomLink
      to={to}
      onClick={closeEverything}
      className={`
        ${className || ''} ${s('select-none', 'menu-item', {disabled, active})}
      `.trim()}
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
  closeEverything: T.func.isRequired,
  disabled: T.bool,
  active: T.bool,
  className: T.string,
};

export default connect(null, {closeEverything})(MenuItem);
