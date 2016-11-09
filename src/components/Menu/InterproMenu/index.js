// @flow
import React, {PropTypes as T} from 'react';

import MenuItem from 'components/Menu/MenuItem';

import {InterPro} from 'menuConfig';

const InterproMenu = (
  {pathname, className, children}
  /*: {pathname: string, className?: string, children?: any} */
) => (
  <ul className={className}>
    {children}
    {InterPro.map(({to, name}) => (
      <li key={to}>
        <MenuItem to={to} active={pathname === to}>
          {name}
        </MenuItem>
      </li>
    ))}
  </ul>
);
InterproMenu.propTypes = {
  pathname: T.string.isRequired,
  className: T.string,
  children: T.any,
};

export default InterproMenu;
