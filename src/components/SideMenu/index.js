import React, {PropTypes as T, Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router/es';

import url from 'url';

import {closeSideNav} from 'actions/creators';
import {EBI, InterPro, singleEntity} from 'menuConfig';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';
import style from './style.css';

const f = foundationPartial(ebiStyles, interproStyles, style);

const menu = [
  {
    name: 'Entity Menu',
    isDrilldown: false,
    className: 'primary',
    options: singleEntity,
    relativePaths: true,
    hide: (data) => (!data || !data.metadata),
  },
  {
    name: 'Interpro Menu',
    isDrilldown: true,
    className: 'secondary',
    options: InterPro,
  },
  {
    name: 'EBI Menu',
    isDrilldown: false,
    options: EBI,
  },
];

const setRootGrayscale = (() => {
  let root;
  const GRAY_SCALE = 25;
  return isGray => {
    if (!root) {
      root = document.getElementById('root');
    }
    root.style.filter = `grayscale(${isGray ? GRAY_SCALE : 0}%)`;
  };
})();

const MenuLink = ({element, closeSideNav, relativePath = false, pathname = '', data}) => {
  const to = (relativePath && pathname !== '/' ? pathname : '') + element.to;
  return (
    <li>
      {
        url.parse(to).host ?
          <a
            href={element.to}
            className={f('icon', `icon-${element.iconClass || 'generic'}`)}
            data-icon={element.icon}
          > {element.name}</a> :
          <Link
            to={to}
            className={f('icon', `icon-${element.iconClass || 'generic'}`, {active: pathname === to})}
            data-icon={element.icon}
            onClick={closeSideNav}
          > {element.name}&nbsp;
            {element.counter && data && data.metadata && data.metadata.counters &&
              <span className={f('badge')}>
                {data.metadata.counters[element.counter] || 0}
              </span>
            }
          </Link>
      }
    </li>
  );
};
MenuLink.propTypes = {
  closeSideNav: T.func.isRequired,
  relativePath: T.bool,
  pathname: T.string,
  data: T.object,
  element: T.shape({
    to: T.string.isRequired,
    name: T.string.isRequired,
    className: T.string,
    icon: T.string,
    counter: T.string,
  }),
};

const MenuSection = ({section, pathname, type, data, isOpen, toggle, closeSideNav}) => (
  <ul
    className={f('off-canvas-list', section.className || 'tertiary', {
      hide: (section.hide && section.hide(data)),
    })}
  >
    <li><label>{section.name}</label></li>
    {section.options
      .filter(({to}) => !section.relativePaths || !to.includes(type))
      .map((e, i) => (
          e.submenu ?
            <SubMenu
              key={i}
              isOpen={isOpen(section.name)}
              toggle={toggle(section.name)}
              closeSideNav={closeSideNav}
              options={e.submenu.options}
            /> :
            <MenuLink
              key={i}
              element={e}
              closeSideNav={closeSideNav}
              relativePath={section.relativePaths}
              pathname={pathname}
              data={data}
            />
      ))
    }
  </ul>
);
MenuSection.propTypes = {
  isOpen: T.func,
  toggle: T.func,
  closeSideNav: T.func.isRequired,
  data: T.object,
  pathname: T.string.isRequired,
  type: T.string.isRequired,
  section: T.shape({
    name: T.string.isRequired,
    submenu: T.object,
    isDrilldown: T.bool,
    className: T.string,
    relativePaths: T.bool,
    hide: T.func,
    options: T.array.isRequired,
  }).isRequired,
};

const SubMenu = ({isOpen = false, toggle, closeSideNav, options}) => (
  <li
    role="menuitem" className={f('is-drilldown-submenu-parent')}
    ariaHaspopup="true" ariaExpanded="false" ariaLabel=" Browse"
  >
    <a onClick={toggle}>
      <i
        className={f('icon', 'icon-functional')}
        data-icon="b"
      /> Browse
    </a>

    <ul
      className={f('is-drilldown-submenu', 'submenu')}
      style={{transform: `translateX(${isOpen ? '-100%' : '0%'})`}}
    >
      <li className={f('js-drilldown-back')}>
        <a onClick={toggle}>Back InterPro menu</a>
      </li>
      {
        options.map((ent, index) => (
          <li key={index}>
            <Link
              to={ent.to}
              className={f('icon', `icon-${ent.iconClass || 'generic'}`)}
              data-icon={ent.icon}
              onClick={closeSideNav}
            > {ent.name}</Link>
          </li>
        ))
      }
    </ul>
  </li>
);
SubMenu.propTypes = {
  isOpen: T.bool,
  toggle: T.func.isRequired,
  closeSideNav: T.func.isRequired,
  options: T.arrayOf(T.shape({
    to: T.string.isRequired,
    icon: T.string,
    name: T.string.isRequired,
  })).isRequired,
};

class SideMenu extends Component{

  constructor(props){
    super(props);
    this.state = {Browse: false};
  }

  toggleSubMenu = (name) => () => {
    const newState = {};
    newState[name] = !this.state[name];
    this.setState(newState);
  }

  render() {
    const {
      sideNav: visible, position = 'left', closeSideNav, pathname, data,
    } = this.props;
    const left = position === 'left';
    const type = pathname.match(/^\/([^/]*)/)[1].toLowerCase();
    setRootGrayscale(visible);
    return (
      <div>
        <aside
          className={
            f('label-col', 'offc-nav', 'shadow-out', {
              expand: visible,
              left_container: left,
              right_container: !left,
            })
          }
          style={{transform: visible ? 'translateX(0)' : ''}}
          role="menu"
          ariaHidden={!visible}
          id="main-nav"
        >

          <a
            className={f('exit-offcanvas', 'icon', 'icon-functional')}
            title="Close menu - handside navigation" id="button-close-rmenu"
            onClick={closeSideNav}
          > <span aria-hidden="true">×</span></a>

          {
            menu.map((section, i) => (
                <div
                  key={i}
                  className={f({'is-drilldown': section.isDrilldown})}
                  style={{maxWidth: '100%'}}
                >
                  <MenuSection
                    pathname={pathname}
                    type={type}
                    data={data}
                    section={section}
                    closeSideNav={closeSideNav}
                    isOpen={(name) => this.state[name]}
                    toggle={(name) => this.toggleSubMenu(name)}
                  />
                </div>
            ))
          }

        </aside>
        <div onClick={closeSideNav}
          className={visible ? style.overlay_visible : style.overlay_hidden}
        />
      </div>
    );
  }
}
SideMenu.propTypes = {
  sideNav: T.bool.isRequired,
  data: T.object,
  position: T.oneOf(['left', 'right']),
  pathname: T.string.isRequired,
  closeSideNav: T.func.isRequired,
};

export default connect(
  ({ui: {sideNav}, data: {data}}) => ({sideNav, data}),
  {closeSideNav}
)(SideMenu);
