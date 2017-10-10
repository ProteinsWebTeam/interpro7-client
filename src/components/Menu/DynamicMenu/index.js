// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import MenuItem from 'components/Menu/MenuItem';

import { schedule } from 'timing-functions/src';

import { InterPro } from 'menuConfig';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
// import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import interproStyles from 'styles/interpro-new.css';
import styles from './styles.css';

const f = foundationPartial(fonts, interproStyles, styles);

/*:: type Props = {
  width: number,
}; */
/*:: type State = {
  [key: string]: boolean,
}; */

const MAX_DELAY_BEFORE_CHECKING_FIT = 500; // ms

const InterProMin = InterPro.filter(item => item.name !== 'Settings');

class DynamicMenu extends PureComponent /*:: <Props, State> */ {
  /*:: _menuItems: Set<HTMLElement>; */
  static defaultProps = {
    width: +Infinity,
  };

  static propTypes = {
    width: T.number.isRequired,
  };

  constructor(props /*: Props */) {
    super(props);
    this._menuItems = new Set();
    this.state = {};
    for (const { name } of InterProMin) {
      this.state[name] = true;
    }
  }

  componentDidMount() {
    this._checkSizes(this.props.width);
  }

  componentDidUpdate() {
    this._checkSizes(this.props.width);
  }

  _checkSizes = async (width /*: number */) => {
    await schedule(MAX_DELAY_BEFORE_CHECKING_FIT);
    let remainingWidth = width;
    for (const menuItem of this._menuItems) {
      if (remainingWidth > 0) {
        const { width } = menuItem.getBoundingClientRect();
        remainingWidth -= width;
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ [menuItem.dataset.name]: remainingWidth >= 0 });
      } else {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ [menuItem.dataset.name]: false });
      }
    }
  };

  _setMenuItemInMap = node => {
    if (node instanceof HTMLElement) this._menuItems.add(node);
  };

  render() {
    const hiddenItems = InterProMin.filter(({ name }) => !this.state[name]);
    return (
      <ul className={f('menu')}>
        {InterProMin.map(({ newTo, name, activeClass }) => (
          <li
            key={name}
            ref={this._setMenuItemInMap}
            data-name={name}
            className={f('menu-item', { visible: this.state[name] || false })}
          >
            <MenuItem newTo={newTo} activeClass={activeClass}>
              {name}
            </MenuItem>
          </li>
        ))}
        <ul
          className={f('menu-item', 'more', { visible: hiddenItems.length })}
          role="tree"
          tabIndex="0"
        >
          …
          {hiddenItems.map(({ newTo, name, activeClass }) => (
            <li
              key={name}
              data-name={name}
              className={f('menu-item', 'visible')}
            >
              <MenuItem newTo={newTo} activeClass={activeClass}>
                {name}
              </MenuItem>
            </li>
          ))}
        </ul>
      </ul>
    );
  }
}

export default DynamicMenu;
