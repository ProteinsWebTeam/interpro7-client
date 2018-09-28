import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { closeSideNav } from 'actions/creators';
import { sideNavSelector } from 'reducers/ui/sideNav';

import EBIMenu from 'components/Menu/EBIMenu';
import InterProMenu from 'components/Menu/InterProMenu';
import EntryMenu from 'components/EntryMenu';
import Link from 'components/generic/Link';
import ServerStatus from './ServerStatus';

import { inert as inertPolyfill } from 'utils/polyfills';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';
import helperClasses from 'styles/helper-classes.css';
import style from './style.css';

const f = foundationPartial(ebiStyles, interproStyles, helperClasses, style);

/*:: type OldIPProps = {
  href: string,
}; */

// TODO: eventually remove all of this logic a few releases after initial launch
class _OldInterProLink extends PureComponent /*:: <OldIPProps> */ {
  static propTypes = {
    href: T.string.isRequired,
  };

  render() {
    return (
      <Link
        className={f('old-interpro-link')}
        href={this.props.href}
        target="_blank"
      >
        See this page in the old InterPro website
      </Link>
    );
  }
}

const mapStateToPropsForOldLink = createSelector(
  state => state.customLocation.description,
  d => {
    const href = 'https://www.ebi.ac.uk/interpro/';
    const { key } = d.main;
    if (key === 'job' && d.job.type === 'InterProScan' && d.job.accession) {
      return { href: `${href}sequencesearch/${d.job.accession}` };
    }
    if (key === 'entry') {
      if (!d.entry.db) {
        return { href };
      } else if (d.entry.db === 'InterPro') {
        if (d.entry.accession) {
          return { href: `${href}entry/${d.entry.accession}/` };
        }
        return { href: `${href}search/` };
      }
      if (d.entry.accession) {
        return { href: `${href}signature/${d.entry.accession}/` };
      }
      return { href: `${href}member-database/${d.entry.db}/` };
    } else if (key === 'protein' && d.protein.accession) {
      return { href: `${href}protein/${d.protein.accession}/` };
    }
    return { href };
  },
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

    this.state = { hasRendered: false };
  }

  static getDerivedStateFromProps({ visible }, { hasRendered }) {
    if (hasRendered || !visible) return null;
    return { hasRendered: true };
  }

  componentDidMount() {
    inertPolyfill();
  }

  render() {
    const { visible, mainAccession, mainType, closeSideNav } = this.props;
    const { hasRendered } = this.state;
    let content = null;
    if (hasRendered || visible) {
      content = (
        <>
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
                <EntryMenu className={f('sidemenu')} usedOnTheSide>
                  <span className={f('menu-label', 'cursor-default')}>
                    {mainType} menu ({mainAccession})
                  </span>
                </EntryMenu>
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
              <li>
                <span className={f('menu-label', 'cursor-default', 'tertiary')}>
                  Connection status
                </span>
                <ServerStatus />
              </li>
            </ul>
          </nav>
        </>
      );
    }
    return (
      <aside
        inert={visible ? undefined : ''}
        aria-hidden={!visible}
        className={f('container', { visible })}
        role="menu"
      >
        {content}
      </aside>
    );
  }
}

const mapStateToProps = createSelector(
  sideNavSelector,
  state => state.customLocation.description.main.key,
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  (visible, mainType, mainAccession) => ({ visible, mainType, mainAccession }),
);

export default connect(
  mapStateToProps,
  { closeSideNav },
)(SideMenu);
