// @flow
import React from 'react';
import T from 'prop-types';

import MenuItem from 'components/Menu/MenuItem';
import SubMenu from 'components/Menu/SubMenu';

import {InterPro} from 'menuConfig';

import {foundationPartial} from 'styles/foundation';
import fonts from 'styles/ebi/fonts.css';

const iconStyle = foundationPartial(fonts);

const InterproMenu = (
  {pathname, className, includeSubMenus = false, children}
  /*: {
    pathname: string,
    className?: string,
    includeSubMenus?: boolean,
    children?: any
  } */
) => (
  <ul className={className}>
    {children}
    {InterPro.map(({to, name, icon, iconClass = 'generic', options}) => (
      includeSubMenus && options ?
        <SubMenu
          key={to}
          pathname={pathname}
          options={options}
          className={className}
        >
          {
            icon &&
            <i
              data-icon={icon}
              className={iconStyle('icon', `icon-${iconClass}`)}
            />
          }
          {name}
        </SubMenu> :
        <li key={to}>
          <MenuItem to={to}>
            {
              icon &&
              <i
                data-icon={icon}
                className={iconStyle('icon', `icon-${iconClass}`)}
              />
            }
            {name}
          </MenuItem>
        </li>
    ))}
  </ul>
);
InterproMenu.propTypes = {
  pathname: T.string.isRequired,
  className: T.string,
  includeSubMenus: T.bool,
  children: T.any,
};

export default InterproMenu;
