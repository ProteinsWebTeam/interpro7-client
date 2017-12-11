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
          ({ newTo, name, icon, iconClass = 'generic', activeClass }) => (
            <li key={name}>
              <MenuItem newTo={newTo} activeClass={activeClass}>
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
