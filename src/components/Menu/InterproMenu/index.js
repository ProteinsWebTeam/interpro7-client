// @flow
import React, {PropTypes as T} from 'react';

import MenuItem from 'components/Menu/MenuItem';

import {InterPro} from 'menuConfig';

import {foundationPartial} from 'styles/foundation';
import fonts from 'styles/ebi/fonts.css';

const iconStyle = foundationPartial(fonts);

const InterproMenu = (
  {pathname, className, children}
  /*: {pathname: string, className?: string, children?: any} */
) => (
  <ul className={className}>
    {children}
    {InterPro.map(({to, name, icon, iconClass = 'generic'}) => (
      <li key={to}>
        <MenuItem to={to} active={pathname === to}>
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
  children: T.any,
};

export default InterproMenu;
