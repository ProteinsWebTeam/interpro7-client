// @flow
import React, {Component} from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import {closeSideNav} from 'actions/creators';
// import {EBI, InterPro, entities, singleEntity} from 'menuConfig';
// import MenuItem from 'components/Menu/MenuItem';
import loadData from 'higherOrder/loadData';
import {getUrlForApi} from 'higherOrder/loadData/defaults';

import EBIMenu from 'components/Menu/EBIMenu';
import InterproMenu from 'components/Menu/InterproMenu';
import SingleEntityMenu from 'components/Menu/SingleEntityMenu';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';
import helperClasses from 'styles/helper-classes.css';
import style from './style.css';

const f = foundationPartial(ebiStyles, interproStyles, helperClasses, style);

class SideMenu extends Component {
  static propTypes = {
    visible: T.bool.isRequired,
    data: T.object,
    loading: T.bool,
    pathname: T.string.isRequired,
    closeSideNav: T.func.isRequired,
  };

  shouldComponentUpdate({visible, loading}) {
    return visible && !loading;
  }

  render() {
    const {visible, pathname, data: {payload, loading}, closeSideNav} = this.props;
    return (
      <div>
        <aside
          className={f('container', {visible})}
          role="menu"
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
              !loading && payload && payload.metadata &&
              <SingleEntityMenu
                data={payload}
                pathname={pathname}
                className={f('primary')}
              >
                <span
                  className={f('menu-label', 'select-none', 'cursor-default')}
                >
                  {(
                    payload.metadata.name.short ||
                    payload.metadata.name.name ||
                    payload.metadata.accession
                  )}
                </span>
              </SingleEntityMenu>
            }
            <InterproMenu
              pathname={pathname}
              className={f('secondary', 'is-drilldown')}
              includeSubMenus={true}
            >
              <span
                className={f('menu-label', 'select-none', 'cursor-default')}
              >
                interpro menu
              </span>
            </InterproMenu>
            <EBIMenu className={f('tertiary')}>
              <span
                className={f('menu-label', 'select-none', 'cursor-default')}
              >
                ebi menu
              </span>
            </EBIMenu>
          </ul>
        </aside>
      </div>
    );
  }
}

// TODO: change logic for menu loading data
const urlBlacklist = new Set(['browse', 'search', 'settings', 'about', 'help']);
const mapStateToUrl = createSelector(
  state => state.settings,
  state => state.location,
  (settings, location) => {
    for (const blacklist of urlBlacklist) {
      if (location.pathname.toLowerCase().includes(blacklist)) {
        return getUrlForApi({settings, location: {pathname: ''}});
      }
    }
    return getUrlForApi({settings, location});
  }
);

const mapStateToProps = createSelector(
  state => state.ui.sideNav,
  state => state.location.pathname,
  (visible, pathname) => ({visible, pathname})
);
export default connect(
  mapStateToProps,
  {closeSideNav}
)(loadData(mapStateToUrl)(SideMenu));
