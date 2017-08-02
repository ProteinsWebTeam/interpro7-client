// @flow
import React from 'react';
import T from 'prop-types';

import MenuItem from 'components/Menu/MenuItem';

import { EBI } from 'menuConfig';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';

const iconStyle = foundationPartial(fonts);

const EBIMenu = (
  { className, children } /*: {className?: string, children?: any} */,
) =>
  <ul className={className}>
    {children}
    {EBI.map(({ href, name, icon, iconClass = 'generic' }) =>
      <li key={href}>
        <MenuItem href={href}>
          {icon &&
            <i
              data-icon={icon}
              className={iconStyle('icon', `icon-${iconClass}`)}
            />}
          {name}
        </MenuItem>
      </li>,
    )}
  </ul>;
EBIMenu.propTypes = {
  className: T.string,
  children: T.any,
};

export default EBIMenu;
