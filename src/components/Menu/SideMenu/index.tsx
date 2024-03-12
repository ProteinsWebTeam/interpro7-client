import React, { PureComponent } from 'react';
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

import cssBinder from 'styles/cssBinder';

// import ebiStyles from 'ebi-framework/css/ebi-global.css';
// import interproStyles from 'styles/interpro-new.css';
import helperClasses from 'styles/helper-classes.css';
import style from './style.css';

const css = cssBinder(helperClasses, style);

type Props = {
  visible: boolean;
  mainAccession?: string | null;
  mainType?: string;
  closeSideNav: typeof closeSideNav;
  showConnectionStatusToast: boolean;
};
type State = {
  hasRendered: boolean;
};

export class SideMenu extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasRendered: false };
  }

  static getDerivedStateFromProps(
    { visible }: { visible: boolean },
    { hasRendered }: { hasRendered: boolean },
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
              title="💡 What is the status of external services?"
              body="A green signal indicates that the external service is online and available. A red signal indicates that InterPro is unable to connect to the external resource."
              toastID="connectivity"
              settingsName="showConnectionStatusToast"
            />
          ) : null}
          <button
            className={css('exit')}
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
                    <div className={css('sidemenu')}>
                      <span className={css('menu-label', 'cursor-default')}>
                        {mainType} menu ({mainAccession})
                      </span>
                    </div>
                  )
                : mainAccession && (
                    <EntryMenu className={css('sidemenu')} usedOnTheSide>
                      <span className={css('menu-label', 'cursor-default')}>
                        {mainType} menu ({mainAccession})
                      </span>
                    </EntryMenu>
                  )}

              <InterProMenu className={css('secondary', 'is-drilldown')}>
                <span className={css('menu-label', 'cursor-default')}>
                  InterPro menu
                </span>
              </InterProMenu>
              <EBIMenu className={css('tertiary')}>
                <span className={css('menu-label', 'cursor-default')}>
                  EBI menu
                </span>
              </EBIMenu>
              <span />
              <li>
                <span
                  className={css('menu-label', 'cursor-default', 'tertiary')}
                >
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
        // @ts-expect-error inert attribute is not defined in TS, so if one day this doen's causes an error is because they added it!
        inert={visible ? undefined : ''}
        aria-hidden={!visible}
        className={css('container', { visible })}
      >
        {content}
      </aside>
    );
  }
}

const mapStateToProps = createSelector(
  sideNavSelector,
  (state: GlobalState) => state.customLocation.description.main.key,
  (state: GlobalState) =>
    state.customLocation.description.main.key &&
    (
      state.customLocation.description[
        state.customLocation.description.main.key
      ] as EndpointLocation
    ).accession,
  (state: GlobalState) =>
    state.settings.notifications.showConnectionStatusToast,
  (visible, mainType, mainAccession, showConnectionStatusToast) => ({
    visible,
    mainType,
    mainAccession,
    showConnectionStatusToast,
  }),
);

export default connect(mapStateToProps, { closeSideNav })(SideMenu);
