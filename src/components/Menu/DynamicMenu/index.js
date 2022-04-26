// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import MenuItem from 'components/Menu/MenuItem';

import { schedule, sleep } from 'timing-functions';

import { InterPro } from 'menuConfig';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import interproStyles from 'styles/interpro-new.css';
import styles from './styles.css';

import dotsvg from 'images/icons/ico-more.svg';

const f = foundationPartial(fonts, interproStyles, styles);

const RECHECK_AFTER_MOUNT = 500; // ms
const MAX_DELAY_BEFORE_CHECKING_FIT = 200; // ms

const InterProMin = InterPro.filter((item) => item.name !== 'Settings');

const MenuItemWithEntities = (
  { to, activeClass, exact, name, entities, nested } /*: { 
      to: Object| function,
      name: string,   
      activeClass?: string | function,
      exact:boolean, 
      nested?:boolean, 
      entities?: Array<{
        to:{}, 
        name: string, 
        exact:boolean, 
      }>  
    } */,
) =>
  entities ? (
    <div className={f('dropdown')}>
      <MenuItem to={to} activeClass={activeClass} exact={exact}>
        <span className={f('arrow')}>▾</span> {name}
      </MenuItem>
      <ul role="tree" tabIndex="0" className={f({ nested })}>
        {entities.map(({ to, name, exact }) => (
          <li key={name} className={f('menu-item')} role="treeitem">
            <MenuItem to={to} activeClass={f('reactive')} exact={exact}>
              {name}
            </MenuItem>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <MenuItem to={to} activeClass={activeClass} exact={exact}>
      {name}
    </MenuItem>
  );

MenuItemWithEntities.propTypes = {
  exact: T.bool,
  name: T.string,
  entities: T.arrayOf(T.object),
  activeClass: T.oneOfType([T.string, T.func]),
  to: T.oneOfType([T.object, T.func]),
  nested: T.bool,
};
/*:: type Props = {
  width: number,
}; */
/*:: type State = {
  [key: string]: boolean,
}; */

class DynamicMenu extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    width: T.number.isRequired,
  };
  /*:: _menuItems: Set<HTMLElement>; */
  /*:: _dotdotdotRef: { current: null | React$ElementRef<'span'> }; */

  static defaultProps = {
    width: +Infinity,
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = {};
    for (const { name } of InterProMin) {
      this.state[name] = true;
    }

    this._menuItems = new Set();
    this._dotdotdotRef = React.createRef();
  }

  async componentDidMount() {
    await sleep(RECHECK_AFTER_MOUNT);
    this._checkSizes(this.props.width);
  }

  componentDidUpdate() {
    this._checkSizes(this.props.width);
  }

  _checkSizes = async (width /*: number */) => {
    await schedule(MAX_DELAY_BEFORE_CHECKING_FIT);
    let remainingWidth =
      width - (this._dotdotdotRef.current?.getBoundingClientRect().width || 0);
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

  _setMenuItemInMap = (node) => {
    if (node instanceof HTMLElement) this._menuItems.add(node);
  };

  render() {
    const hiddenItems = InterProMin.filter(({ name }) => !this.state[name]);
    return (
      <ul className={f('menu')}>
        {InterProMin.map(({ to, name, activeClass, exact, entities }) => (
          <li
            key={name}
            ref={this._setMenuItemInMap}
            data-name={name}
            className={f('menu-item', { visible: this.state[name] || false })}
            data-testid={`menu-tab-${name.toLowerCase().replace(/\s+/g, '_')}`}
          >
            <MenuItemWithEntities
              to={to}
              activeClass={activeClass}
              exact={exact}
              name={name}
              entities={entities}
            />
          </li>
        ))}
        <ul
          className={f('menu-item', 'view-more', {
            visible: hiddenItems.length,
          })}
          role="tree"
          tabIndex="0"
        >
          <span className={f('more-icon-container')} ref={this._dotdotdotRef}>
            <img src={dotsvg} width="30px" alt="view all menu items" />
          </span>

          {hiddenItems.map(({ to, name, activeClass, exact, entities }) => (
            <li key={name} className={f('menu-item')} role="treeitem">
              <MenuItemWithEntities
                to={to}
                activeClass={activeClass}
                exact={exact}
                name={name}
                entities={entities}
                nested={true}
              />
            </li>
          ))}
        </ul>
      </ul>
    );
  }
}

export default DynamicMenu;
