import React, { PropsWithChildren } from 'react';

import MenuItem from 'components/Menu/MenuItem';

import { entities } from 'menuConfig';

import cssBinder from 'styles/cssBinder';
const css = cssBinder();

const EntitiesMenu = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => (
  <ul className={className}>
    {children}
    {entities.map(({ to, name }) => (
      <li key={name}>
        <MenuItem to={to} activeClass={css('active')}>
          {name}
        </MenuItem>
      </li>
    ))}
  </ul>
);

export default EntitiesMenu;
