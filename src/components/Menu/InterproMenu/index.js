// @flow
import React, {PropTypes as T} from 'react';

import MenuItem from 'components/Menu/MenuItem';
import SubMenu from 'components/Menu/SubMenu';

import {InterPro} from 'menuConfig';

const InterproMenu = (
  {pathname, className, includeSubMenues = false, children}
  /*:
    {pathname: string, className?: string, includeSubMenues?: boolean, children?: any}
  */
) => (
  <ul className={className}>
    {children}
    {InterPro.map(({to, name, options}) => (
      includeSubMenues && options ?
        <SubMenu
          key={to}
          pathname={pathname}
          options={options}
          className={className}
        >{name}</SubMenu> :
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
  includeSubMenues: T.bool,
  children: T.any,
};

export default InterproMenu;
