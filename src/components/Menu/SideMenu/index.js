import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { closeSideNav } from 'actions/creators';
import { sideNavSelector } from 'reducers/ui/sideNav';

import EBIMenu from 'components/Menu/EBIMenu';
import InterProMenu from 'components/Menu/InterProMenu';
import SingleEntityMenu from 'components/Menu/SingleEntityMenu';
import Link from 'components/generic/Link';
import ServerStatus from './ServerStatus';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.scss';
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
    } else if (key === 'protein' && d.entry.accession) {
      return { href: `${href}protein/${d.entry.accession}/` };
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

  static getDerivedStateFromProps({ visible }, { hasRendered }) {
    if (hasRendered || !visible) return null;
    return { hasRendered: true };
  }

  constructor(props) {
    super(props);

    this.state = { hasRendered: false };
  }

  render() {
    const { visible, mainAccession, mainType, closeSideNav } = this.props;
    const { hasRendered } = this.state;
    let content = null;
    if (hasRendered || visible) {
      content = (
        <React.Fragment>
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
              <li>
                <span className={f('menu-label', 'cursor-default', 'tertiary')}>
                  Connection status
                </span>
                <ServerStatus />
              </li>
            </ul>
          </nav>
        </React.Fragment>
      );
    }
    return (
      <aside
        inert={!visible}
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

export default connect(mapStateToProps, { closeSideNav })(SideMenu);
