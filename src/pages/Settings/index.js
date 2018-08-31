import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { DEV } from 'config';

import { noop } from 'lodash-es';

import {
  schemaProcessDataWebPage,
  schemaProcessDataPageSection,
} from 'schema_org/processors';

import { changeSettings, resetSettings } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import theme from 'styles/theme-interpro.css';
import local from './styles.css';
import loadable from 'higherOrder/loadable';
import { EntryColorMode } from 'utils/entry-color';

const f = foundationPartial(ebiGlobalStyles, theme, local);

// Generate async components
const Advanced = loadable({
  loader: () =>
    import(/* webpackChunkName: "about-advanced" */ 'components/Settings/Advanced'),
});

const NavigationSettings = ({ navigation: { pageSize } }) => (
  <form data-category="navigation">
    <h4>Navigation settings</h4>
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
  </form>
);
NavigationSettings.propTypes = {
  navigation: T.shape({
    pageSize: T.number.isRequired,
  }).isRequired,
  handleChange: T.func.isRequired,
};

const UISettings = ({
  ui: { lowGraphics, colorDomainsBy, structureViewer },
}) => (
  <form data-category="ui">
    <h4>UI settings</h4>
    <SchemaOrgData
      data={{
        name: 'UI settings',
        description: 'User Interface options',
      }}
      processData={schemaProcessDataPageSection}
    />
    <div className={f('row')}>
      <div className={f('medium-12', 'column')}>
        <p>Low graphics mode:</p>
        <p>
          <small>Recommended for low-end devices</small>
        </p>
        <div className={f('switch', 'large')}>
          <input
            type="checkbox"
            checked={lowGraphics}
            className={f('switch-input')}
            name="lowGraphics"
            id="lowGraphics-input"
            onChange={noop}
          />
          <label className={f('switch-paddle')} htmlFor="lowGraphics-input">
            <span className={f('show-for-sr')}>Low graphics mode:</span>
            <span className={f('switch-active')} aria-hidden="true">
              On
            </span>
            <span className={f('switch-inactive')} aria-hidden="true">
              Off
            </span>
          </label>
        </div>
      </div>
    </div>
    <div className={f('row')}>
      <div className={f('medium-12', 'column')}>
        <p>Color Domains:</p>
        <p>
          <small>Selection mode to color by</small>
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
        <p>Display structure viewer all the time:</p>
        <p>
          <small>
            On some low-end devices, small screens, or under network or battery
            constraints, we might decide to not display the structure viewer by
            default. It will still be available on demand. Do you still want to
            display the viewer all the time?
          </small>
        </p>
        <div className={f('switch', 'large')}>
          <input
            type="checkbox"
            checked={structureViewer}
            className={f('switch-input')}
            name="structureViewer"
            id="structureViewer-input"
            onChange={noop}
          />
          <label className={f('switch-paddle')} htmlFor="structureViewer-input">
            <span className={f('show-for-sr')}>
              Structure viewer always visible:
            </span>
            <span className={f('switch-active')} aria-hidden="true">
              Yes
            </span>
            <span className={f('switch-inactive')} aria-hidden="true">
              No
            </span>
          </label>
        </div>
      </div>
    </div>
  </form>
);
UISettings.propTypes = {
  ui: T.shape({
    lowGraphics: T.bool.isRequired,
  }).isRequired,
};

const CacheSettings = ({ cache: { enabled } }) => (
  <form data-category="cache">
    <h4>Cache settings</h4>
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
        <div className={f('switch', 'large')}>
          <input
            type="checkbox"
            checked={enabled}
            className={f('switch-input')}
            name="enabled"
            id="cache-input"
            onChange={noop}
          />
          <label className={f('switch-paddle')} htmlFor="cache-input">
            <span className={f('show-for-sr')}>Caching:</span>
            <span className={f('switch-active')} aria-hidden="true">
              On
            </span>
            <span className={f('switch-inactive')} aria-hidden="true">
              Off
            </span>
          </label>
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

const getStatusText = status => {
  if (status === null) return 'Unknown';
  return status ? 'Reachable' : 'Unreachable';
};

const EndpointSettings = ({
  category,
  endpointDetails: { protocol, hostname, port, root },
  children,
  status,
}) => (
  <form data-category={category}>
    <h4>{children}</h4>
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
            title={`Status: ${status}`}
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
    hostname: T.string.isRequired,
    port: T.string.isRequired,
    root: T.string.isRequired,
  }).isRequired,
  children: T.any.isRequired,
  status: T.bool,
};

const getStatusForEndpoint = endpoint =>
  createSelector(
    state => state.status.servers[endpoint].status,
    status => ({ status }),
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

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

class Settings extends PureComponent {
  static propTypes = {
    settings: T.shape({
      navigation: T.object.isRequired,
      ui: T.object.isRequired,
      cache: T.object.isRequired,
      api: T.object.isRequired,
      ebi: T.object.isRequired,
    }).isRequired,
    changeSettings: T.func.isRequired,
    resetSettings: T.func.isRequired,
  };

  _handleReset = () => this.props.resetSettings();

  render() {
    const {
      settings: {
        navigation = {},
        ui = {},
        cache = {},
        api = {},
        ebi = {},
        ipScan = {},
      },
      changeSettings,
    } = this.props;
    return (
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
          <section onChange={changeSettings}>
            <h3>Settings</h3>

            <NavigationSettings
              navigation={navigation}
              handleChange={changeSettings}
            />

            <UISettings ui={ui} />

            <CacheSettings cache={cache} />

            <APIEndpointSettings category="api" endpointDetails={api}>
              API Settings {!DEV && '(modification temporarily disabled)'}
            </APIEndpointSettings>
            <EBIEndpointSettings category="ebi" endpointDetails={ebi}>
              EBI Search Settings{' '}
              {!DEV && '(modification temporarily disabled)'}
            </EBIEndpointSettings>
            <IPScanEndpointSettings category="ipScan" endpointDetails={ipScan}>
              InterProScan Settings{' '}
              {!DEV && '(modification temporarily disabled)'}
            </IPScanEndpointSettings>

            <button onClick={this._handleReset} className={f('button')}>
              Reset settings to default values
            </button>
          </section>

          <Advanced />
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings,
  settings => ({ settings }),
);

export default connect(
  mapStateToProps,
  { changeSettings, resetSettings },
)(Settings);
