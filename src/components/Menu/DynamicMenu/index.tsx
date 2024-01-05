import React, { PureComponent } from 'react';

import MenuItem from 'components/Menu/MenuItem';

import { schedule, sleep } from 'timing-functions';

import { InterPro, MenuItemProps } from 'menuConfig';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from './styles.css';

import dotsvg from 'images/icons/ico-more.svg';

const css = cssBinder(fonts, styles);

const RECHECK_AFTER_MOUNT = 500; // ms
const MAX_DELAY_BEFORE_CHECKING_FIT = 200; // ms

const InterProMin = InterPro.filter((item) => item.name !== 'Settings');

const MenuItemWithEntities = ({
  to,
  activeClass,
  exact,
  name,
  entities,
  nested,
}: MenuItemProps & { nested?: boolean }) =>
  entities ? (
    <div className={css('dropdown')}>
      <MenuItem to={to} activeClass={activeClass} exact={exact}>
        <span className={css('arrow')}>▾</span> {name}
      </MenuItem>
      <ul role="tree" tabIndex={0} className={css({ nested })}>
        {entities.map(({ to, name, exact }) => (
          <li
            key={name}
            className={css('menu-item')}
            role="treeitem"
            aria-selected="false"
          >
            <MenuItem to={to} activeClass={css('reactive')} exact={exact}>
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

type Props = {
  width: number;
};
type State = {
  [key: string]: boolean;
};

class DynamicMenu extends PureComponent<Props, State> {
  private _menuItems: Set<HTMLElement>;
  private _dotdotdotRef: React.RefObject<HTMLSpanElement>;

  static defaultProps = {
    width: +Infinity,
  };

  constructor(props: Props) {
    super(props);

    const state: State = {};
    for (const { name } of InterProMin) {
      state[name] = true;
    }
    this.state = state;

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

  _checkSizes = async (width: number) => {
    await schedule(MAX_DELAY_BEFORE_CHECKING_FIT);
    let remainingWidth =
      width - (this._dotdotdotRef.current?.getBoundingClientRect().width || 0);
    for (const menuItem of this._menuItems) {
      if (remainingWidth > 0) {
        const { width } = menuItem.getBoundingClientRect();
        remainingWidth -= width;
        this.setState({ [menuItem.dataset.name || '']: remainingWidth >= 0 });
      } else {
        this.setState({ [menuItem.dataset.name || '']: false });
      }
    }
  };

  _setMenuItemInMap = (node: unknown) => {
    if (node instanceof HTMLElement) this._menuItems.add(node);
  };

  render() {
    const hiddenItems = InterProMin.filter(({ name }) => !this.state[name]);
    return (
      <ul className={css('menu')}>
        {InterProMin.map(({ to, name, activeClass, exact, entities }) => (
          <li
            key={name}
            ref={this._setMenuItemInMap}
            data-name={name}
            className={css('menu-item', { visible: this.state[name] || false })}
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
          className={css('menu-item', 'view-more', {
            visible: hiddenItems.length,
          })}
          role="tree"
          tabIndex={0}
        >
          <span className={css('more-icon-container')} ref={this._dotdotdotRef}>
            <img src={dotsvg} width="30px" alt="view all menu items" />
          </span>

          {hiddenItems.map(({ to, name, activeClass, exact, entities }) => (
            <li
              key={name}
              className={css('menu-item')}
              role="treeitem"
              aria-selected="false"
            >
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
