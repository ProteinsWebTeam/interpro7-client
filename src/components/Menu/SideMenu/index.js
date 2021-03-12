// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { closeSideNav } from 'actions/creators';
import { sideNavSelector } from 'reducers/ui/sideNav';

import EBIMenu from 'components/Menu/EBIMenu';
import InterProMenu from 'components/Menu/InterProMenu';
import EntryMenu from 'components/EntryMenu';
import ServerStatus from './ServerStatus';
import Tip from 'components/Tip';

import { inert as inertPolyfill } from 'utils/polyfills';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import interproStyles from 'styles/interpro-new.css';
import helperClasses from 'styles/helper-classes.css';
import style from './style.css';

const f = foundationPartial(ebiStyles, interproStyles, helperClasses, style);

/*:: type Props = {
  visible: boolean,
  mainAccession?: string,
  mainType?: string,
  closeSideNav: function,
  showConnectionStatusToast: boolean,
}; */
/*:: type State = {
  hasRendered: boolean,
}; */

export class SideMenu extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    visible: T.bool.isRequired,
    mainAccession: T.string,
    mainType: T.string,
    closeSideNav: T.func.isRequired,
    showConnectionStatusToast: T.bool.isRequired,
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = { hasRendered: false };
  }

  static getDerivedStateFromProps(
    { visible } /*: {visible: boolean} */,
    { hasRendered } /*: {hasRendered: boolean} */,
  ) {
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
        <div role="menu">
          {this.props.visible && this.props.showConnectionStatusToast ? (
            <Tip
              title="💡 What is the status of external dependencies?"
              body="The green signal is displayed when an external dependency is available whist a red signal indicates
              that InterPro cannot connect to the resource."
              toastID="connectivity"
              settingsName="showConnectionStatusToast"
            />
          ) : null}
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
              {mainType === 'result'
                ? mainAccession && (
                    <div className={f('sidemenu')}>
                      <span className={f('menu-label', 'cursor-default')}>
                        {mainType} menu ({mainAccession})
                      </span>
                    </div>
                  )
                : mainAccession && (
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
              <li>
                <span className={f('menu-label', 'cursor-default', 'tertiary')}>
                  Connection status
                </span>
                <ServerStatus />
              </li>
            </ul>
          </nav>
        </div>
      );
    }
    return (
      <aside
        inert={visible ? undefined : ''}
        aria-hidden={!visible}
        className={f('container', { visible })}
      >
        {content}
      </aside>
    );
  }
}

const mapStateToProps = createSelector(
  sideNavSelector,
  (state) => state.customLocation.description.main.key,
  (state) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  (state) => state.settings.notifications.showConnectionStatusToast,
  (visible, mainType, mainAccession, showConnectionStatusToast) => ({
    visible,
    mainType,
    mainAccession,
    showConnectionStatusToast,
  }),
);

export default connect(mapStateToProps, { closeSideNav })(SideMenu);
