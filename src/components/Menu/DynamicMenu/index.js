// @flow
import React, { PureComponent } from 'react';

import MenuItem from 'components/Menu/MenuItem';

import { InterPro } from 'menuConfig';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from './styles.css';

const f = foundationPartial(fonts, styles);

/*:: type Props = {}; */

class DynamicMenu extends PureComponent /*:: <Props> */ {
  constructor(props /*: Props */) {
    super(props);
    console.log(props);
  }

  componentWillReceiveProps(nextProps /*: Props */) {
    console.log('next props', nextProps);
  }

  render() {
    return (
      <ul className={f('menu')}>
        {InterPro.map(
          ({ newTo, name, icon, iconClass = 'generic', activeClass }) => (
            <li key={name}>
              <MenuItem newTo={newTo} activeClass={activeClass}>
                {name}
              </MenuItem>
            </li>
          )
        )}
      </ul>
    );
  }
}

export default DynamicMenu;
