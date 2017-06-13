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
  {className, includeSubMenus = false, children}
  /*: {
    pathname: string,
    className?: string,
    includeSubMenus?: boolean,
    children?: any
  } */
) => (
  <ul className={className}>
    {children}
    {InterPro.map(({newTo, name, icon, iconClass = 'generic', options}) => (
      includeSubMenus && options ?
        <SubMenu
          key={name}
          pathname={''}
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
        <li key={name}>
          <MenuItem newTo={newTo}>
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
  className: T.string,
  includeSubMenus: T.bool,
  children: T.any,
};

export default InterproMenu;
