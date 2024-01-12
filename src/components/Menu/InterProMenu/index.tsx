import React, { PropsWithChildren } from 'react';

import MenuItem from 'components/Menu/MenuItem';
import { InterPro } from 'menuConfig';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './styles.css';

const css = cssBinder(fonts, local);

type Props = PropsWithChildren<{
  className?: string;
}>;

const InterProMenu = ({ className, children }: Props) => {
  return (
    <ul className={`${className || ''} ${css('interpro-menu')}`}>
      {children}
      {InterPro.map(
        ({ to, name, icon, iconClass = 'generic', activeClass, exact }) => (
          <li key={name}>
            <MenuItem to={to} activeClass={activeClass} exact={exact}>
              {icon !== 'H' && (
                <i
                  data-icon={icon}
                  className={css('icon', `icon-${iconClass}`)}
                />
              )}
              {icon === 'H' && <span />}
              {name}
            </MenuItem>
          </li>
        ),
      )}
    </ul>
  );
};

export default InterProMenu;
