import React, {PropTypes as T} from 'react';

import MenuItem from 'components/Menu/MenuItem';

import {entities} from 'menuConfig';

import ebiStyles from 'styles/ebi-global.css';

const EntitiesMenu = ({className, children}) => (
  <ul className={className}>
    {children}
    {entities.map(({to, name}) => (
      <li key={to}>
        <MenuItem to={to} activeClassName={ebiStyles.active}>{name}</MenuItem>
      </li>
    ))}
  </ul>
);
EntitiesMenu.propTypes = {
  className: T.string,
  children: T.any,
};

export default EntitiesMenu;
