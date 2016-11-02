import React, {PropTypes as T, Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router/es';

import {closeSideNav} from 'actions/creators';
import {menuEntries} from 'components/Header/DynamicMenu';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';
import style from './style.css';

const f = foundationPartial(ebiStyles, interproStyles, style);


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

const BrowseMenu = ({isOpen, toggleBrowse, closeSideNav}) => (
  <li
    role="menuitem" className={f('is-drilldown-submenu-parent')}
    aria-haspopup="true" aria-expanded="false" aria-label=" Browse"
  >
    <a onClick={toggleBrowse}>
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
        <a onClick={toggleBrowse}>Back InterPro menu</a>
      </li>
      {
        menuEntries.entities.map((ent, index) => (
          <li key={index}>
            <Link
              to={ent.to}
              className={f('icon', ent.className)}
              data-icon={ent.icon}
              onClick={closeSideNav}
            > {ent.name}</Link>
          </li>
        ))
      }
    </ul>
  </li>
);
BrowseMenu.propTypes = {
  isOpen: T.bool.isRequired,
  toggleBrowse: T.func.isRequired,
  closeSideNav: T.func.isRequired,
};

class SideMenu extends Component{

  constructor(props){
    super(props);
    this.state = {browse: false};
  }

  toggleBrowse = () => {
    this.setState({browse: !this.state.browse});
  }

  render() {
    const {sideNav: visible, position = 'left', closeSideNav} = this.props;
    const left = position === 'left';
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
          aria-hidden={!visible}
          id="main-nav"
        >

          <a
            className={f('exit-offcanvas', 'icon', 'icon-functional')}
            title="Close menu - handside navigation" id="button-close-rmenu"
            onClick={closeSideNav}
          > <span aria-hidden="true">×</span></a>

          <div className={f('is-drilldown')} style={{maxWidth: '100%'}}>
            <ul className={f('off-canvas-list', 'secondary')}>
              <li><label>InterPro menu</label></li>
              {
                menuEntries.home.map((e, i) => (
                  (e.name === 'Browse') ?
                    <BrowseMenu
                      key={i}
                      isOpen={this.state.browse}
                      toggleBrowse={this.toggleBrowse}
                      closeSideNav={closeSideNav}
                    /> :
                    <li key={i}>
                      <Link
                        to={e.to}
                        className={f('icon', e.className)}
                        data-icon={e.icon}
                        onClick={closeSideNav}
                      > {e.name}</Link>
                    </li>
                ))
              }
            </ul>
          </div>

          <ul className={f('off-canvas-list', 'tertiary')}>
            <li><label>EBI menu</label></li>
            {[
              {link: 'http://www.ebi.ac.uk', icon: 'H', name: 'EBI home'},
              {link: 'http://www.ebi.ac.uk/services', icon: '(', name: 'Services'},
              {link: 'http://www.ebi.ac.uk/research', icon: ')', name: 'Research'},
              {link: 'http://www.ebi.ac.uk/training', icon: 't', name: 'Training'},
              {link: 'http://www.ebi.ac.uk/about', icon: 'i', name: 'About EBI'},
            ].map((e, i) => (
              <li key={i}>
                <a
                  href={e.link}
                  className={f('icon', 'icon-generic')}
                  data-icon={e.icon}
                > {e.name}</a>
              </li>
            ))
            }
          </ul>

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
  position: T.oneOf(['left', 'right']),
  closeSideNav: T.func.isRequired,
};

export default connect(
  ({ui: {sideNav}}) => ({sideNav}),
  {closeSideNav}
)(SideMenu);
