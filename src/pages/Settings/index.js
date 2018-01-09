// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import noop from 'lodash-es/noop';

import loadData from 'higherOrder/loadData';

import { changeSettings, resetSettings } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import theme from 'styles/theme-interpro.css';
import styles from './styles.css';

const f = foundationPartial(theme, styles);

const NavigationSettings = ({ navigation: { pageSize, autoRedirect } }) => (
  <form data-category="navigation">
    <h4>Navigation settings</h4>
    <div className={f('row')}>
      <div className={f('medium-12', 'column')}>
        <label>
          Number of results by page:
          <div className={f('row')}>
            <div className={f('medium-4', 'column')}>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={pageSize}
                name="pageSize"
                style={{ width: '100%' }}
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
        <p>
          Redirect automatically to an entity page if an exact match has been
          found:
        </p>
        <div className={f('switch', 'large')}>
          <input
            type="checkbox"
            checked={autoRedirect}
            className={f('switch-input')}
            name="autoRedirect"
            id="autoRedirect-input"
            onChange={noop}
          />
          <label className={f('switch-paddle')} htmlFor="autoRedirect-input">
            <span className={f('show-for-sr')}>Automatic redirect:</span>
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
NavigationSettings.propTypes = {
  navigation: T.shape({
    pageSize: T.number.isRequired,
    autoRedirect: T.bool.isRequired,
  }).isRequired,
  handleChange: T.func.isRequired,
};

const UISettings = ({ ui: { lowGraphics } }) => (
  <form data-category="ui">
    <h4>UI settings</h4>
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
    enabled: T.bool.isRequired,
  }).isRequired,
};

const getStatusText = (loading, ok) => {
  if (loading) return 'Unknown';
  return ok ? 'Reachable' : 'Unreachable';
};

const EndpointSettings = ({
  category,
  endpointDetails: { hostname, port, root },
  data: { loading, ok, status },
  children,
}) => (
  <form data-category={category}>
    <h4>{children}</h4>
    <div className={f('row')}>
      <div className={f('medium-3', 'column')}>
        <label>
          Hostname:
          <input type="text" value={hostname} name="hostname" onChange={noop} />
        </label>
      </div>
      <div className={f('medium-3', 'column')}>
        <label>
          Port:
          <input
            type="number"
            min="1"
            value={port}
            name="port"
            onChange={noop}
          />
        </label>
      </div>
      <div className={f('medium-3', 'column')}>
        <label>
          Root:
          <input type="text" value={root} name="root" onChange={noop} />
        </label>
      </div>
      <div className={f('medium-3', 'column')}>
        <label>
          Status:
          <output
            className={f('button', 'output', 'hollow', {
              secondary: loading,
              success: !loading && ok,
              alert: !loading && !ok,
            })}
            title={`Status: ${status}`}
          >
            {getStatusText(loading, ok)}
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
  data: T.shape({
    loading: T.bool.isRequired,
    payload: T.bool,
  }),
};

const getUrlForEndpoint = endpoint =>
  createSelector(
    state => state.settings[endpoint],
    ({ protocol, hostname, port, root }) =>
      `${protocol}//${hostname}:${port}${root}`,
  );

const fetchOptions = { method: 'HEAD', cache: 'no-store', noCache: true };
const APIEndpointSettings = loadData({
  getUrl: getUrlForEndpoint('api'),
  fetchOptions,
})(EndpointSettings);

const EBIEndpointSettings = loadData({
  getUrl: getUrlForEndpoint('ebi'),
  fetchOptions,
})(EndpointSettings);

const IPScanEndpointSettings = loadData({
  getUrl: getUrlForEndpoint('ipScan'),
  fetchOptions,
})(EndpointSettings);

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
              API Settings
            </APIEndpointSettings>
            <EBIEndpointSettings category="ebi" endpointDetails={ebi}>
              EBI Search Settings
            </EBIEndpointSettings>
            <IPScanEndpointSettings category="ipScan" endpointDetails={ipScan}>
              InterProScan Settings
            </IPScanEndpointSettings>
            <button onClick={this._handleReset} className={f('button')}>
              Reset settings to default values
            </button>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings,
  settings => ({ settings }),
);

export default connect(mapStateToProps, { changeSettings, resetSettings })(
  Settings,
);
