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
    const { key } = d.main;
    if (key === 'entry') {
      if (!d.entry.db) {
        return href;
      } else if (d.entry.db === 'InterPro') {
        if (d.entry.accession) {
          return `${href}entry/${d.entry.accession}/`;
        }
        return `${href}search/`;
      }
      if (d.entry.accession) {
        return `${href}signature/${d.entry.accession}/`;
      }
      return `${href}member-database/${d.entry.db}/`;
    } else if (key === 'protein' && d.entry.accession) {
      return `${href}protein/${d.entry.accession}/`;
    }
    return href;
  },
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
      >
        See this page in the old InterPro website
      </Link>
    );
  }
}

const mapStateToPropsForOldLink = createSelector(
  state => state.customLocation.description,
  description => ({ description }),
);

const OldInterProLink = connect(mapStateToPropsForOldLink)(_OldInterProLink);

/*:: type Props = {
  visible: boolean,
  mainAccession: ?string,
  closeSideNav: function,
}; */
/*:: type State = {
  hasRendered: boolean,
}; */

class SideMenu extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    visible: T.bool.isRequired,
    mainAccession: T.string,
    mainType: T.string,
    closeSideNav: T.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hasRendered: false,
    };
  }

  componentWillReceiveProps({ visible }) {
    if (!this.state.hasRendered && visible)
      this.setState({ hasRendered: true });
  }

  render() {
    const { visible, mainAccession, mainType, closeSideNav } = this.props;
    if (!(this.state.hasRendered || visible)) return null;
    return (
      <aside className={f('container', { visible })} role="menu">
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
                <span className={f('menu-label', 'cursor-default')}>
                  {mainType} menu ({mainAccession})
                </span>
              </SingleEntityMenu>
            )}
            <InterProMenu className={f('secondary', 'is-drilldown')}>
              <span className={f('menu-label', 'cursor-default')}>
                InterPro menu
              </span>
            </InterProMenu>
            <EBIMenu className={f('tertiary')}>
              <span className={f('menu-label', 'cursor-default')}>
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
    );
  }
}

// TODO: change logic for menu loading data
// const urlBlacklist = new Set(['browse', 'search', 'settings', 'about', 'help']);
// const mapStateToUrl = createSelector(
//   state => state.settings,
//   state => state.location,
//   state => state.customLocation,
//   (settings, location, customLocation) => {
//     for (const blacklist of urlBlacklist) {
//       if (location.pathname.toLowerCase().includes(blacklist)) {
//         return getUrlForApi({settings, location: {pathname: ''}, customLocation});
//       }
//     }
//     return getUrlForApi({settings, location, customLocation});
//   }
// );

const mapStateToProps = createSelector(
  state => state.ui.sideNav,
  state => state.customLocation.description.main.key,
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  (visible, mainType, mainAccession) => ({ visible, mainType, mainAccession }),
);

export default connect(mapStateToProps, { closeSideNav })(SideMenu);
