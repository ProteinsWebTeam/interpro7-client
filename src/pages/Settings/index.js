// @flow
import React, { PureComponent, useState, useEffect } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import ToggleSwitch from 'components/ToggleSwitch';
import Link from 'components/generic/Link';
import { DEV } from 'config';

import { noop } from 'lodash-es';

import {
  schemaProcessDataWebPage,
  schemaProcessDataPageSection,
} from 'schema_org/processors';

import { installPrompt } from 'main';

import loadable from 'higherOrder/loadable';

import {
  changeSettings,
  changeSettingsRaw,
  resetSettings,
  addToast,
} from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';
import { askNotificationPermission } from 'utils/browser-notifications';

import { EntryColorMode } from 'utils/entry-color';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

import theme from 'styles/theme-interpro.css';
import local from './styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, theme, local);

const DEFAULT_SEC = 20;

// Generate async components
const Advanced = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "about-advanced" */ 'components/Settings/Advanced'
    ),
});

const NavigationSettings = (
  {
    navigation: { pageSize, secondsToRetry },
  } /*: {navigation: {pageSize: number, secondsToRetry: number}} */,
) => (
  <form data-category="navigation">
    <h4 id="settings-navigation">Navigation settings</h4>
    <SchemaOrgData
      data={{
        name: 'Navigation settings',
        description: 'Number of results per page, redirection rules',
      }}
      processData={schemaProcessDataPageSection}
    />
    <div className={f('row')}>
      <div className={f('medium-12', 'column')}>
        <label>
          Number of results per page:
          <div className={f('row')}>
            <div className={f('medium-4', 'column')}>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={pageSize}
                name="pageSize"
                className={local.fullwidth}
                onChange={noop}
              />
            </div>
            <div className={f('medium-8', 'column')}>{pageSize}</div>
          </div>
        </label>
      </div>
    </div>
    <div className={f('row')}>
      <div className={f('medium-12', 'column')}>
        <label>
          Time (sec) to retry timed out queries:
          <div className={f('row')}>
            <div className={f('medium-4', 'column')}>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={secondsToRetry || DEFAULT_SEC}
                name="secondsToRetry"
                className={local.fullwidth}
                onChange={noop}
              />
            </div>
            <div className={f('medium-8', 'column')}>{secondsToRetry}</div>
          </div>
        </label>
      </div>
    </div>
  </form>
);
NavigationSettings.propTypes = {
  navigation: T.shape({
    pageSize: T.number.isRequired,
    secondsToRetry: T.number.isRequired,
  }).isRequired,
};

const NotificationSettings = (
  {
    notifications: {
      showTreeToast,
      showConnectionStatusToast,
      showSettingsToast,
      showHelpToast,
      showCtrlToZoomToast,
    },
  } /*: {notifications: {showTreeToast: boolean, showCtrlToZoomToast: boolean, showConnectionStatusToast: boolean, showSettingsToast: boolean, showHelpToast: boolean}} */,
) => {
  const [status /*: string */, setStatus] = useState(
    Notification.permission === 'granted' ||
      Notification.permission === 'denied'
      ? 'answered'
      : 'not yet',
  );
  return (
    <form data-category="notifications">
      <h4 id="settings-notification">Notification settings</h4>
      <SchemaOrgData
        data={{
          name: 'Notification settings',
          description: 'Notifications in the website can be turned on/off.',
        }}
        processData={schemaProcessDataPageSection}
      />
      <div className={f('row')}>
        <div className={f('medium-12', 'column')}>
          {status === 'answered' ? (
            <div className={f('callout')}>
              The browser notification has been {Notification.permission}{' '}
              permission. If you wish to change the preference, it has to be
              done in the browser settings.
            </div>
          ) : (
            <>
              <p>
                Allow us to send you browser notifications when one of your Jobs
                or Downloads finishes.
              </p>
              <button
                type="button"
                className={f('button')}
                onClick={() => askNotificationPermission(setStatus)}
              >
                Enable notifications
              </button>
            </>
          )}
        </div>
        <div className={f('medium-12', 'column')}>
          <p>
            There are few tips shown in the website on how to use features
            efficiently. It can be turned on/off.
          </p>
          <div className={f('row')}>
            <div className={f('medium-4', 'column')}>
              <table>
                <thead>
                  <tr>
                    <th>Tip</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Taxonomy Tree navigation</td>
                    <td>
                      <input
                        type="checkbox"
                        name="showTreeToast"
                        id="showTreeToast-input"
                        checked={showTreeToast}
                        onChange={noop}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Check connectivity</td>
                    <td>
                      <input
                        type="checkbox"
                        name="showConnectionStatusToast"
                        id="showConnectionStatusToast-input"
                        checked={showConnectionStatusToast}
                        onChange={noop}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Use CTRL and scroll to zoom</td>
                    <td>
                      <input
                        type="checkbox"
                        name="showCtrlToZoomToast"
                        id="showCtrlToZoomToast-input"
                        checked={showCtrlToZoomToast}
                        onChange={noop}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Customise Settings</td>
                    <td>
                      <input
                        type="checkbox"
                        name="showSettingsToast"
                        id="showSettingsToast-input"
                        checked={showSettingsToast}
                        onChange={noop}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Help Links</td>
                    <td>
                      <input
                        type="checkbox"
                        name="showHelpToast"
                        id="showHelpToast-input"
                        checked={showHelpToast}
                        onChange={noop}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

NotificationSettings.propTypes = {
  notifications: T.shape({
    showTreeToast: T.bool.isRequired,
    showConnectionStatusToast: T.bool.isRequired,
    showSettingsToast: T.bool.isRequired,
    showHelpToast: T.bool.isRequired,
    showCtrlToZoomToast: T.bool.isRequired,
  }).isRequired,
};

const UISettings = (
  {
    ui: { lowGraphics, colorDomainsBy, labelContent, structureViewer },
    changeSettingsRaw,
  } /*:
  { ui: {
      lowGraphics: boolean,
      colorDomainsBy: string,
      labelContent: {
        accession: boolean,
        name: boolean,
        short: boolean,
      },
      structureViewer: boolean
    },
    changeSettingsRaw: function,
  } */,
) => {
  // Making sure there is a least 1 value for label Content
  useEffect(() => {
    const { accession, name, short } = labelContent;
    if (!accession && !name && !short) {
      changeSettingsRaw('ui', 'labelContent', {
        accession: true,
        name,
        short,
      });
    }
  }, [labelContent]);
  return (
    <form data-category="ui">
      <h4 id="settings-ui">UI settings</h4>
      <SchemaOrgData
        data={{
          name: 'UI settings',
          description: 'User Interface options',
        }}
        processData={schemaProcessDataPageSection}
      />
      <div className={f('row')}>
        <div className={f('medium-12', 'column')}>
          <header>Low graphics mode:</header>
          <p>
            <small>Recommended for low-end devices</small>
          </p>
          <ToggleSwitch
            switchCond={lowGraphics}
            name={'lowGraphics'}
            id={'lowGraphics-input'}
            SRLabel={'Low graphics mode'}
          />
        </div>
      </div>
      <div className={f('row')}>
        <div className={f('medium-12', 'column')}>
          <header>Colour Domains:</header>
          <p>
            <small>Selection mode to colour by in the feature viewer</small>
          </p>
          <select
            className={f('select-inline')}
            value={colorDomainsBy}
            name="colorDomainsBy"
            onChange={noop}
            onBlur={noop}
          >
            <option value={EntryColorMode.ACCESSION}>Accession</option>
            <option value={EntryColorMode.MEMBER_DB}>Member Database</option>
            <option value={EntryColorMode.DOMAIN_RELATIONSHIP}>
              Domain Relationship
            </option>
          </select>
        </div>
      </div>
      <div className={f('row')}>
        <div className={f('medium-12', 'column')}>
          <header>Label Content:</header>
          <p>
            <small>The content of the labels in the feature viewer</small>
          </p>
          <div className={f('row')}>
            <div className={f('medium-4', 'column')}>
              <table>
                <thead>
                  <tr>
                    <th>Label</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Accession</td>
                    <td>
                      <input
                        type="checkbox"
                        name="labelContent.accession"
                        id="labelContentAccession-input"
                        checked={labelContent.accession}
                        onChange={noop}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Name</td>
                    <td>
                      <input
                        type="checkbox"
                        name="labelContent.name"
                        id="labelContentName-input"
                        checked={labelContent.name}
                        onChange={noop}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Short Name</td>
                    <td>
                      <input
                        type="checkbox"
                        name="labelContent.short"
                        id="labelContentShort-input"
                        checked={labelContent.short}
                        onChange={noop}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className={f('row')}>
        <div className={f('medium-12', 'column')}>
          <header>Display structure viewer all the time:</header>
          <p>
            <small>
              On some low-end devices, small screens, or under network or
              battery constraints, we might decide to not display the structure
              viewer by default. It will still be available on demand. Do you
              still want to display the viewer all the time?
            </small>
          </p>
          <ToggleSwitch
            switchCond={structureViewer}
            name={'structureViewer'}
            id={'structureViewer-input'}
            SRLabel={'Structure viewer always visible'}
            onValue={'Yes'}
            offValue={'No'}
          />
        </div>
      </div>
    </form>
  );
};
UISettings.propTypes = {
  ui: T.shape({
    lowGraphics: T.bool.isRequired,
    colorDomainsBy: T.string.isRequired,
    labelContent: T.shape({
      accession: T.bool,
      name: T.bool,
      short: T.bool,
    }),
    structureViewer: T.bool.isRequired,
  }).isRequired,
  changeSettingsRaw: T.func,
};

const CacheSettings = (
  { cache: { enabled } } /*: {cache: {enabled: boolean}} */,
) => (
  <form data-category="cache">
    <h4 id="settings-cache">Cache settings</h4>
    <SchemaOrgData
      data={{
        name: 'Cache settings',
        description: 'Options for locally saved data',
      }}
      processData={schemaProcessDataPageSection}
    />
    <div className={f('row')}>
      <div className={f('medium-12', 'column')}>
        <p>Caching:</p>
        <ToggleSwitch
          switchCond={enabled}
          name={'enabled'}
          id={'cache-input'}
          SRLabel={'Caching'}
        />
        <div>
          <button
            type="button"
            className={f('button')}
            onClick={() => {
              window.sessionStorage.clear();
            }}
          >
            Clear Local Cache
          </button>
        </div>
      </div>
    </div>
  </form>
);
CacheSettings.propTypes = {
  cache: T.shape({
    enabled: T.bool,
  }).isRequired,
};

const getStatusText = (status) => {
  if (status === null) return 'Unknown';
  return status ? 'Reachable' : 'Unreachable';
};

const EndpointSettings = (
  {
    category,
    endpointDetails: { protocol, hostname, port, root },
    children,
    status,
  } /*: {category: string, endpointDetails: {protocol: string, hostname: string, port: string, root: string,}, children: any, status: boolean} */,
) => (
  <form data-category={category}>
    <h5>{children}</h5>
    <SchemaOrgData
      data={{
        name: children[0],
        description: `hostname, port and root ${children[0]}`,
      }}
      processData={schemaProcessDataPageSection}
    />

    <div className={f('row')}>
      <div className={f('medium-2', 'column')}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          Protocol:
          <select
            name="protocol"
            value={protocol}
            onChange={noop}
            onBlur={noop}
            readOnly={!DEV}
          >
            <option value="http:">http://</option>
            <option value="https:">https://</option>
          </select>
        </label>
      </div>
      <div className={f('medium-3', 'column')}>
        <label>
          Hostname:
          <input
            type="text"
            value={hostname}
            name="hostname"
            onChange={noop}
            readOnly={!DEV}
          />
        </label>
      </div>
      <div className={f('medium-1', 'column')}>
        <label>
          Port:
          <input
            type="number"
            min="1"
            value={port}
            name="port"
            onChange={noop}
            readOnly={!DEV}
          />
        </label>
      </div>
      <div className={f('medium-3', 'column')}>
        <label>
          Root:
          <input
            type="text"
            value={root}
            name="root"
            onChange={noop}
            readOnly={!DEV}
          />
        </label>
      </div>
      <div className={f('medium-3', 'column')}>
        <label>
          Status:
          <output
            className={f('button', 'output', 'hollow', {
              secondary: status === null,
              success: status === true,
              alert: status === false,
            })}
            title={`Status: ${status ? 'TRUE' : 'FALSE'}`}
          >
            {getStatusText(status)}
          </output>
        </label>
      </div>
    </div>
  </form>
);
EndpointSettings.propTypes = {
  category: T.string.isRequired,
  endpointDetails: T.shape({
    protocol: T.string.isRequired,
    hostname: T.string.isRequired,
    port: T.string.isRequired,
    root: T.string.isRequired,
  }).isRequired,
  children: T.any.isRequired,
  status: T.bool,
};

const getStatusForEndpoint = (endpoint) =>
  createSelector(
    (state) => state.status.servers[endpoint].status,
    (status) => ({ status }),
  );

const APIEndpointSettings = connect(getStatusForEndpoint('api'))(
  EndpointSettings,
);
const EBIEndpointSettings = connect(getStatusForEndpoint('ebi'))(
  EndpointSettings,
);
const IPScanEndpointSettings = connect(getStatusForEndpoint('ipScan'))(
  EndpointSettings,
);
const Genome3DEndpointSettings = connect(getStatusForEndpoint('genome3d'))(
  EndpointSettings,
);
const WikipediaEndpointSettings = connect(getStatusForEndpoint('wikipedia'))(
  EndpointSettings,
);
const AlphaFoldEndpointSettings = connect(getStatusForEndpoint('alphafold'))(
  EndpointSettings,
);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});
/*:: type Props = {
  addToast: function
};*/
/*:: type State= {|
  event: ?{
    prompt: function,
    userChoice: {
      outcome: string,
    }
  },
|};*/

class _AddToHomeScreen extends PureComponent /*:: <Props,State> */ {
  static propTypes = {
    addToast: T.func.isRequired,
  };

  constructor(props /*: Props */) {
    super(props);

    // see if the event has been caught before somewhere else while browsing
    this.state = { event: installPrompt.event };
  }

  componentDidMount() {
    window.addEventListener('beforeinstallprompt', this.#beforeInstall);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeinstallprompt', this.#beforeInstall);
  }

  #beforeInstall = (event) => {
    event.preventDefault();
    this.setState({ event });
  };

  _handleClick = async () => {
    const { event } = this.state;
    if (!event) return;
    event.prompt();
    const { outcome } = await event.userChoice;
    if (outcome === 'accepted') {
      // user accepted browser prompt
      this.props.addToast(
        {
          title: 'Added to homescreen or desktop',
          body: 'Keep in mind that you still need to be online to browse our data',
          ttl: 5000, // eslint-disable-line no-magic-numbers
        },
        'add-to-homescreen-banner',
      );
    } else {
      // user refused 🤔🤷🏻‍♂️
      this.props.addToast(
        {
          title: 'Failed to add to homescreen or desktop',
          body: 'It looks like you refused to add this website to the homescreen or desktop after all',
          ttl: 5000, // eslint-disable-line no-magic-numbers
        },
        'add-to-homescreen-banner',
      );
    }
    // remove stored event, cannot use it twice
    this.setState({ event: null });
    installPrompt.event = null;
  };

  render() {
    if (!this.state.event) return null;
    return (
      <div className={f('row')}>
        <div className={f('columns', 'large-12')}>
          <h3>Add InterPro to your home screen or desktop</h3>
          <button
            type="button"
            className={f('button')}
            onClick={this._handleClick}
          >
            Add it!
          </button>
        </div>
      </div>
    );
  }
}
const AddToHomeScreen = connect(undefined, { addToast })(_AddToHomeScreen);

const HashLink = (
  {
    firstVisibleTitle,
    hash,
    label,
  } /*: { firstVisibleTitle: string|null, hash:string, label: string } */,
) => (
  <li>
    <Link
      to={(current) => ({
        ...current,
        hash,
      })}
      href="#settings-notification"
      activeClass={() => firstVisibleTitle === hash && f('active')}
    >
      {label}
    </Link>
  </li>
);
HashLink.propTypes = {
  firstVisibleTitle: T.string,
  hash: T.string,
  label: T.string,
};

/*::
type SettingsProps = {
  settings: {
    navigation: Object,
    notifications: Object,
    ui: Object,
    cache: Object,
    api: Object,
    ebi: Object,
    ipScan: Object,
    genome3d: Object,
    wikipedia: Object,
    alphafold: Object,
  },
  changeSettings: function,
  changeSettingsRaw: function,
  resetSettings: function,
  customLocation: Object,
};
type SettingsState = {
  firstVisibleTitle: null | string,
}
*/

class Settings extends PureComponent /*:: <SettingsProps, SettingsState> */ {
  static propTypes = {
    settings: T.shape({
      navigation: T.object.isRequired,
      notifications: T.object.isRequired,
      ui: T.object.isRequired,
      cache: T.object.isRequired,
      api: T.object.isRequired,
      ebi: T.object.isRequired,
      ipScan: T.object.isRequired,
      genome3d: T.object.isRequired,
      wikipedia: T.object.isRequired,
      alphafold: T.object.isRequired,
    }).isRequired,
    changeSettings: T.func.isRequired,
    changeSettingsRaw: T.func.isRequired,
    resetSettings: T.func.isRequired,
    customLocation: T.object.isRequired,
  };
  state = {
    firstVisibleTitle: null,
  };

  componentDidMount() {
    document.addEventListener('scroll', this._updateHashBasedOnScroll);
  }

  _updateHashBasedOnScroll = () => {
    const offsetForStickyHeader = 100;
    const firstVisibleTitle = Array.from(document.querySelectorAll('h4[id]'))
      .map((e) => ({
        id: e.id,
        top: e.getBoundingClientRect().top - offsetForStickyHeader,
      }))
      .filter(({ top }) => top >= 0)?.[0]?.id;
    if (this.state.firstVisibleTitle !== firstVisibleTitle) {
      this.setState({ firstVisibleTitle });
    }
  };
  _handleReset = () => this.props.resetSettings();

  render() {
    const {
      settings: {
        navigation = {},
        notifications = {},
        ui = {},
        cache = {},
        api = {},
        ebi = {},
        ipScan = {},
        genome3d = {},
        wikipedia = {},
        alphafold = {},
      },
      changeSettings,
      changeSettingsRaw,
    } = this.props;
    return (
      <>
        <AddToHomeScreen />

        <div className={f('row')}>
          <SchemaOrgData
            data={{
              name: 'InterPro Settings Page',
              description: 'Configuration options for the website',
              location: window.location,
            }}
            processData={schemaProcessDataWebPage}
          />
          <div className={f('columns', 'large-12')}>
            <h3>Settings</h3>
            <div className={f('menu-and-content')}>
              <nav>
                <ul className={f('no-bullet')}>
                  <HashLink
                    firstVisibleTitle={this.state.firstVisibleTitle}
                    hash="settings-navigation"
                    label="Navigation"
                  />
                  <HashLink
                    firstVisibleTitle={this.state.firstVisibleTitle}
                    hash="settings-notification"
                    label="Notifications"
                  />
                  <HashLink
                    firstVisibleTitle={this.state.firstVisibleTitle}
                    hash="settings-ui"
                    label="User Interfaces"
                  />
                  <HashLink
                    firstVisibleTitle={this.state.firstVisibleTitle}
                    hash="settings-cache"
                    label="Cache"
                  />
                  <HashLink
                    firstVisibleTitle={this.state.firstVisibleTitle}
                    hash="settings-servers"
                    label="Servers"
                  />
                  <HashLink
                    firstVisibleTitle={this.state.firstVisibleTitle}
                    hash="settings-devs"
                    label="Developer Information"
                  />
                </ul>
              </nav>
              <section>
                <section onChange={changeSettings}>
                  <NavigationSettings navigation={navigation} />
                  <hr />
                  <NotificationSettings notifications={notifications} />
                  <hr />
                  <UISettings ui={ui} changeSettingsRaw={changeSettingsRaw} />
                  <hr />
                  <CacheSettings cache={cache} />
                  <hr />
                  <h4 id="settings-servers">Servers settings</h4>
                  <APIEndpointSettings category="api" endpointDetails={api}>
                    API Settings {!DEV && '(modification temporarily disabled)'}
                  </APIEndpointSettings>
                  <EBIEndpointSettings category="ebi" endpointDetails={ebi}>
                    EBI Search Settings{' '}
                    {!DEV && '(modification temporarily disabled)'}
                  </EBIEndpointSettings>
                  <IPScanEndpointSettings
                    category="ipScan"
                    endpointDetails={ipScan}
                  >
                    InterProScan Settings{' '}
                    {!DEV && '(modification temporarily disabled)'}
                  </IPScanEndpointSettings>
                  <Genome3DEndpointSettings
                    category="genome3d"
                    endpointDetails={genome3d}
                  >
                    Genome3D Settings{' '}
                    {!DEV && '(modification temporarily disabled)'}
                  </Genome3DEndpointSettings>
                  <WikipediaEndpointSettings
                    category="wikipedia"
                    endpointDetails={wikipedia}
                  >
                    Wikipedia Settings{' '}
                    {!DEV && '(modification temporarily disabled)'}
                  </WikipediaEndpointSettings>
                  <AlphaFoldEndpointSettings
                    category="alphafold"
                    endpointDetails={alphafold}
                  >
                    AlphaFold API Settings{' '}
                    {!DEV && '(modification temporarily disabled)'}
                  </AlphaFoldEndpointSettings>

                  <button onClick={this._handleReset} className={f('button')}>
                    Reset settings to default values
                  </button>
                </section>
                <hr />
                <h4 id="settings-devs">Developer Information</h4>
                <Advanced />
              </section>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.settings,
  customLocationSelector,
  (settings, customLocation) => ({ settings, customLocation }),
);

export default connect(mapStateToProps, {
  changeSettings,
  resetSettings,
  changeSettingsRaw,
})(Settings);
