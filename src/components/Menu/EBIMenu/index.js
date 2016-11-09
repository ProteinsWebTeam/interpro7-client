// @flow
import React, {PropTypes as T} from 'react';

import MenuItem from 'components/Menu/MenuItem';

import {EBI} from 'menuConfig';

const EBIMenu = (
  {className, children}/*: {className?: string, children?: any} */
) => (
  <ul className={className}>
    {children}
    {EBI.map(({to, name}) => (
      <li key={to}>
        <MenuItem to={to}>
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
