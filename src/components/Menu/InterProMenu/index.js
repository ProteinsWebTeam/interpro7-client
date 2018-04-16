// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import MenuItem from 'components/Menu/MenuItem';

import { InterPro } from 'menuConfig';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from './styles.css';

const f = foundationPartial(fonts, styles);

/*:: type Props = {
  className?: string,
  children?: any,
}; */

class InterProMenu extends PureComponent /*:: <Props> */ {
  static propTypes = {
    className: T.string,
    children: T.any,
  };

  render() {
    const { className, children } = this.props;
    return (
      <ul className={`${className || ''} ${f('interpro-menu')}`}>
        {children}
        {InterPro.map(
          ({ to, name, icon, iconClass = 'generic', activeClass, exact }) => (
            <li key={name}>
              <MenuItem to={to} activeClass={activeClass} exact={exact}>
                {icon !== 'H' && (
                  <i
                    data-icon={icon}
                    className={f('icon', `icon-${iconClass}`)}
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
  }
}

export default InterProMenu;
