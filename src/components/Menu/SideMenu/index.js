// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { closeSideNav } from 'actions/creators';

import EBIMenu from 'components/Menu/EBIMenu';
import InterproMenu from 'components/Menu/InterproMenu';
import SingleEntityMenu from 'components/Menu/SingleEntityMenu';

import { foundationPartial } from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';
import helperClasses from 'styles/helper-classes.css';
import style from './style.css';

const f = foundationPartial(ebiStyles, interproStyles, helperClasses, style);

class SideMenu extends PureComponent {
  static propTypes = {
    visible: T.bool.isRequired,
    mainAccession: T.string,
    closeSideNav: T.func.isRequired,
  };

  render() {
    const { visible, mainAccession, closeSideNav } = this.props;
    return (
      <div>
        <aside
          className={f('container', { visible })}
          role="menu"
          id="main-nav"
        >
          <button
            className={f('exit')}
            title="Close side menu"
            onClick={closeSideNav}
            aria-hidden="true"
          >
            ×
          </button>
          <ul>
            {mainAccession &&
              <SingleEntityMenu className={f('primary')}>
                <span
                  className={f('menu-label', 'select-none', 'cursor-default')}
                >
                  {mainAccession}
                </span>
              </SingleEntityMenu>}
            <InterproMenu
              pathname={''}
              className={f('secondary', 'is-drilldown')}
              includeSubMenus={true}
            >
              <span
                className={f('menu-label', 'select-none', 'cursor-default')}
              >
                InterPro menu
              </span>
            </InterproMenu>
            <EBIMenu className={f('tertiary')}>
              <span
                className={f('menu-label', 'select-none', 'cursor-default')}
              >
                EBI menu
              </span>
            </EBIMenu>
          </ul>
        </aside>
      </div>
    );
  }
}

// TODO: change logic for menu loading data
// const urlBlacklist = new Set(['browse', 'search', 'settings', 'about', 'help']);
// const mapStateToUrl = createSelector(
//   state => state.settings,
//   state => state.location,
//   state => state.newLocation,
//   (settings, location, newLocation) => {
//     for (const blacklist of urlBlacklist) {
//       if (location.pathname.toLowerCase().includes(blacklist)) {
//         return getUrlForApi({settings, location: {pathname: ''}, newLocation});
//       }
//     }
//     return getUrlForApi({settings, location, newLocation});
//   }
// );

const mapStateToProps = createSelector(
  state => state.ui.sideNav,
  state => state.newLocation.description.mainAccession,
  (visible, mainAccession) => ({ visible, mainAccession })
);

export default connect(mapStateToProps, { closeSideNav })(SideMenu);
