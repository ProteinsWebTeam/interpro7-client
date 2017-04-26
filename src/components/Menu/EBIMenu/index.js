// @flow
import React from 'react';
import T from 'prop-types';

import MenuItem from 'components/Menu/MenuItem';

import {EBI} from 'menuConfig';

import {foundationPartial} from 'styles/foundation';
import fonts from 'styles/ebi/fonts.css';

const iconStyle = foundationPartial(fonts);

const EBIMenu = (
  {className, children}/*: {className?: string, children?: any} */
) => (
  <ul className={className}>
    {children}
    {EBI.map(({to, name, icon, iconClass = 'generic'}) => (
      <li key={to}>
        <MenuItem to={to} >
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
EBIMenu.propTypes = {
  className: T.string,
  children: T.any,
};

export default EBIMenu;
