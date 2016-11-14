// @flow
import React, {PropTypes as T, Component} from 'react';
import {connect} from 'react-redux';
// import {Link} from 'react-router/es';

import {closeSideNav} from 'actions/creators';
// import {EBI, InterPro, entities, singleEntity} from 'menuConfig';
// import MenuItem from 'components/Menu/MenuItem';

import EBIMenu from 'components/Menu/EBIMenu';
import InterproMenu from 'components/Menu/InterproMenu';
import SingleEntityMenu from 'components/Menu/SingleEntityMenu';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';
import helperClasses from 'styles/helper-classes.css';
import style from './style.css';

const f = foundationPartial(ebiStyles, interproStyles, helperClasses, style);

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

// const MenuLink = (
//   {element, closeSideNav, relativePath = false, pathname = '', data}
// ) => {
//   const to = (relativePath && pathname !== '/' ? pathname : '') + element.to;
//   const isBadgePresent = (
//     element.counter && data && data.metadata && data.metadata.counters
//   );
//   return (
//     <li>
//       <MenuItem
//         to={to}
//         className={f('flex', {active: pathname === to})}
//         onClick={closeSideNav}
//       >
//         {element.icon &&
//           <i
//             className={f('icon', `icon-${element.iconClass || 'generic'}`)}
//             data-icon={element.icon}
//           />
//         }
//         {element.name}
//         {isBadgePresent &&
//           <span className={f('badge')}>
//             {data.metadata.counters[element.counter] || 0}
//           </span>
//         }
//       </MenuItem>
//     </li>
//   );
// };
// MenuLink.propTypes = {
//   closeSideNav: T.func.isRequired,
//   relativePath: T.bool,
//   pathname: T.string,
//   data: T.object,
//   element: T.shape({
//     to: T.string.isRequired,
//     name: T.string.isRequired,
//     className: T.string,
//     icon: T.string,
//     counter: T.string,
//   }),
// };

// const MenuSection = (
//   {section, pathname, type, data, isOpen, toggle, closeSideNav}
// ) => (
//   <ul
//     className={f('off-canvas-list', section.className || 'tertiary', {
//       hide: (section.hide && section.hide(data)),
//     })}
//   >
//     {section.options
//       .filter(({to}) => !section.relativePaths || !to.includes(type))
//       .map((e, i) => (
//         e.submenu ?
//           <SubMenu
//             key={i}
//             isOpen={isOpen(section.name)}
//             toggle={toggle(section.name)}
//             closeSideNav={closeSideNav}
//             options={e.submenu.options}
//           /> :
//           <MenuLink
//             key={i}
//             element={e}
//             closeSideNav={closeSideNav}
//             relativePath={section.relativePaths}
//             pathname={pathname}
//             data={data}
//           />
//       ))
//     }
//   </ul>
// );
// MenuSection.propTypes = {
//   isOpen: T.func,
//   toggle: T.func,
//   closeSideNav: T.func.isRequired,
//   data: T.object,
//   pathname: T.string.isRequired,
//   type: T.string.isRequired,
//   section: T.shape({
//     name: T.string.isRequired,
//     submenu: T.object,
//     isDrilldown: T.bool,
//     className: T.string,
//     relativePaths: T.bool,
//     hide: T.func,
//     options: T.array.isRequired,
//   }).isRequired,
// };

// const SubMenu = ({isOpen = false, toggle, closeSideNav, options}) => (
//   <li
//     role="menuitem" className={f('is-drilldown-submenu-parent')}
//     aria-haspopup="true" aria-expanded="false" aria-label="Browse"
//   >
//     <a onClick={toggle}>
//       <i
//         className={f('icon', 'icon-functional')}
//         data-icon="b"
//       /> Browse
//     </a>
//
//     <ul
//       className={f('is-drilldown-submenu', 'submenu')}
//       style={{transform: `translateX(${isOpen ? '-100%' : '0%'})`}}
//     >
//       <li className={f('js-drilldown-back')}>
//         <a onClick={toggle}>Back InterPro menu</a>
//       </li>
//       {
//         options.map((ent, index) => (
//           <li key={index}>
//             <Link
//               to={ent.to}
//               className={f('icon', `icon-${ent.iconClass || 'generic'}`)}
//               data-icon={ent.icon}
//               onClick={closeSideNav}
//             > {ent.name}</Link>
//           </li>
//         ))
//       }
//     </ul>
//   </li>
// );
// SubMenu.propTypes = {
//   isOpen: T.bool,
//   toggle: T.func.isRequired,
//   closeSideNav: T.func.isRequired,
//   options: T.arrayOf(T.shape({
//     to: T.string.isRequired,
//     icon: T.string,
//     name: T.string.isRequired,
//   })).isRequired,
// };

class SideMenu extends Component{
  // constructor(props){
  //   super(props);
  //   this.state = {Browse: false};
  // }

  // toggleSubMenu = (name) => () => {
  //   const newState = {};
  //   newState[name] = !this.state[name];
  //   this.setState(newState);
  // };

  shouldComponentUpdate({loading}) {
    return !loading;
  }

  render() {
    const {visible, pathname, data, closeSideNav} = this.props;
    setRootGrayscale(visible);
    return (
      <div>
        <aside
          className={
            /* f('label-col', 'offc-nav', 'shadow-out', {
              expand: visible,
            }) */
            f('container', {visible})
          }
          role="menu"
          aria-hidden={!visible}
          id="main-nav"
        >
          <button
            className={f('exit')}
            title="Close menu - handside navigation"
            onClick={closeSideNav}
            aria-hidden="true"
          >
            ×
          </button>
          <ul>
            {
              data && data.metadata &&
              <SingleEntityMenu
                data={data}
                pathname={pathname}
                className={f('primary')}
              >
                <span
                  className={f('menu-label', 'select-none', 'cursor-default')}
                >
                  {(
                    data.metadata.name.short ||
                    data.metadata.name.name ||
                    data.metadata.accession
                  )}
                </span>
              </SingleEntityMenu>
            }
            <InterproMenu
              pathname={pathname}
              className={f('secondary', 'is-drilldown')}
              includeSubMenus={true}
            >
              <span className={f('menu-label', 'select-none', 'cursor-default')}>
                interpro menu
              </span>
            </InterproMenu>
            <EBIMenu className={f('tertiary')}>
              <span className={f('menu-label', 'select-none', 'cursor-default')}>
                ebi menu
              </span>
            </EBIMenu>
            {/*
              menu.map((section, i) => (
                <li key={i}>
                  {section.name}
                  <ul
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
                  </ul>
                </li>
              ))
            */}
          </ul>
        </aside>
      </div>
    );
  }
}
SideMenu.propTypes = {
  visible: T.bool.isRequired,
  data: T.object,
  loading: T.bool.isRequired,
  pathname: T.string.isRequired,
  closeSideNav: T.func.isRequired,
};

export default connect(
  ({ui: {sideNav}, data: {data, loading}}) => (
    {visible: sideNav, data, loading}
  ),
  {closeSideNav}
)(SideMenu);
