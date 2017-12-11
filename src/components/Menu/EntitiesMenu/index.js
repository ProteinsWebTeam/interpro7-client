// @flow
import React from 'react';
import T from 'prop-types';

import MenuItem from 'components/Menu/MenuItem';

import { entities } from 'menuConfig';

import ebiStyles from 'ebi-framework/css/ebi-global.scss';

const EntitiesMenu = (
  { className, children } /*: {className?: string, children?: any} */,
) => (
  <ul className={className}>
    {children}
    {entities.map(({ newTo, name }) => (
      <li key={name}>
        <MenuItem newTo={newTo} activeClass={ebiStyles.active}>
          {name}
        </MenuItem>
      </li>
    ))}
  </ul>
);
EntitiesMenu.propTypes = {
  className: T.string,
  children: T.any,
};

export default EntitiesMenu;
