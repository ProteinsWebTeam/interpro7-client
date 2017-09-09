// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { closeSideNav } from 'actions/creators';

import EBIMenu from 'components/Menu/EBIMenu';
import InterProMenu from 'components/Menu/InterProMenu';
import SingleEntityMenu from 'components/Menu/SingleEntityMenu';
import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.scss';
import interproStyles from 'styles/interpro-new.css';
import helperClasses from 'styles/helper-classes.css';
import style from './style.css';

const f = foundationPartial(ebiStyles, interproStyles, helperClasses, style);

// TODO: eventually remove all of this logic a few releases after initial launch
const getOldHref = createSelector(
  description => description,
  d => {
    const href = 'https://www.ebi.ac.uk/interpro/';
    if (d.mainType === 'entry') {
      if (!d.mainDB) {
        return href;
      } else if (d.mainDB.toLowerCase() === 'interpro') {
        if (d.mainAccession) {
          return `${href}entry/${d.mainAccession}/`;
        }
        return `${href}search/`;
      }
      if (!d.mainAccession) {
        return `${href}signature/${d.mainAccession}/`;
      }
      return `${href}member-database/${d.mainDB}/`;
    } else if (d.mainType === 'protein' && d.mainAccession) {
      return `${href}protein/${d.mainAccession}/`;
    }
    return href;
  }
);

/*:: type OldIPProps = {
  description: Object,
}; */

class _OldInterProLink extends PureComponent /*:: <OldIPProps> */ {
  static propTypes = {
    description: T.object.isRequired,
  };

  render() {
    return (
      <Link
        className={f('old-interpro-link')}
        href={getOldHref(this.props.description)}
        target="_blank"
        rel="noopener noreferer"
      >
        See this page in the old InterPro website
      </Link>
    );
  }
}

const mapStateToPropsForOldLink = createSelector(
  state => state.newLocation.description,
  description => ({ description })
);

const OldInterProLink = connect(mapStateToPropsForOldLink)(_OldInterProLink);

/*:: type Props = {
  visible: boolean,
  mainAccession: ?string,
  closeSideNav: function,
}; */

class SideMenu extends PureComponent /*:: <Props> */ {
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
          <nav>
            <ul>
              {mainAccession && (
                <SingleEntityMenu className={f('primary')}>
                  <span
                    className={f('menu-label', 'select-none', 'cursor-default')}
                  >
                    {mainAccession}
                  </span>
                </SingleEntityMenu>
              )}
              <InterProMenu
                pathname={''}
                className={f('secondary', 'is-drilldown')}
              >
                <span
                  className={f('menu-label', 'select-none', 'cursor-default')}
                >
                  InterPro menu
                </span>
              </InterProMenu>
              <EBIMenu className={f('tertiary')}>
                <span
                  className={f('menu-label', 'select-none', 'cursor-default')}
                >
                  EBI menu
                </span>
              </EBIMenu>
              <span />
              <li className={f('menu-label', 'cursor-default', 'tertiary')}>
                <OldInterProLink />
              </li>
            </ul>
          </nav>
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
