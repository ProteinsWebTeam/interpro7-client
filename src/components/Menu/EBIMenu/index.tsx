import React, { PropsWithChildren } from 'react';

import MenuItem from 'components/Menu/MenuItem';

import { EBI } from 'menuConfig';

import cssBinder from 'styles/cssBinder';
import fonts from 'EBI-Icon-fonts/fonts.css';

const iconStyle = cssBinder(fonts);

const EBIMenu = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => (
  <ul className={className}>
    {children}
    {EBI.map(({ href, name, icon, iconClass = 'generic' }) => (
      <li key={href}>
        <MenuItem href={href}>
          {icon && (
            <i
              data-icon={icon}
              className={iconStyle('icon', `icon-${iconClass}`)}
            />
          )}
          {name}
        </MenuItem>
      </li>
    ))}
  </ul>
);

export default EBIMenu;
