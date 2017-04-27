import React from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import loadData from 'higherOrder/loadData';

import {changeSettings, resetSettings} from 'actions/creators';

import styles from './styles.css';
import {foundationPartial} from 'styles/foundation';

const f = foundationPartial(styles);

const PaginationSettings = ({pagination, handleChange}) => (
  <form data-category="pagination">
    <h4>Pagination settings</h4>
    <div className={f('row')}>
      <div className={f('medium-12', 'column')}>
        <label>
          number of returned results by page:
          <div className={f.row}>
            <div className={f('medium-11', 'column')}>
              <input
                type="range"
                min="1"
                max="200"
                step="1"
                value={pagination.pageSize}
                name="pageSize"
                onChange={handleChange}
                style={{width: '100%'}}
              />
            </div>
            <div className={f('medium-1', 'column')}>
              {pagination.pageSize}
            </div>
          </div>
        </label>
      </div>
    </div>
  </form>
);
PaginationSettings.propTypes = {
  pagination: T.object.isRequired,
  handleChange: T.func.isRequired,
};

const UISettings = (/* {ui, handleChange}*/) => (
  <form data-category="ui">
    <h4>UI settings</h4>
  </form>
);
UISettings.propTypes = {
  ui: T.object.isRequired,
  handleChange: T.func.isRequired,
};

const CacheSettings = ({cache: {enabled}, handleChange}) => (
  <form data-category="cache">
    <h4>Cache settings</h4>
    <div className={f('row')}>
      <div className={f('medium-12', 'column')}>
        <label>
          Caching:
          <input
            type="checkbox"
            checked={enabled}
            name="enabled"
            onChange={handleChange}
          />
          <span className={f('label', {warning: !enabled})}>
            {enabled ? 'enabled' : 'disabled'}
          </span>
        </label>
      </div>
    </div>
  </form>
);
CacheSettings.propTypes = {
  cache: T.object.isRequired,
  handleChange: T.func.isRequired,
};

const getStatusText = (loading, response) => {
  if (loading) return 'Unknown';
  return response ? 'Reachable' : 'Unreachable';
};

const EndpointSettings = ({
  handleChange,
  category,
  endpointDetails: {hostname, port, root},
  data: {loading, payload},
  children,
}) => (
  <form data-category={category}>
    <h4>{children}</h4>
    <div className={f('row')}>
      <div className={f('medium-3', 'column')}>
        <label>
          Hostname:
          <input
            type="text"
            value={hostname}
            name="hostname"
            onChange={handleChange}
          />
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
            onChange={handleChange}
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
            onChange={handleChange}
          />
        </label>
      </div>
      <div className={f('medium-3', 'column')}>
        <label>
          Status:
          <output
            className={f(
              'button',
              'output',
              'hollow',
              {
                secondary: loading,
                success: !loading && payload,
                alert: !loading && !payload,
              }
            )}
          >
            {getStatusText(loading, payload)}
          </output>
        </label>
      </div>
    </div>
  </form>
);
EndpointSettings.propTypes = {
  handleChange: T.func.isRequired,
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

const fetchOptions = {method: 'HEAD', cache: 'no-store', noCache: true};
const APIEndpointSettings = loadData({
  getUrl({settings: {api}}) {
    return `${api.protocol}//${api.hostname}:${api.port}${api.root}entry`;
  },
  fetchOptions,
})(EndpointSettings);

const EBIEndpointSettings = loadData({
  getUrl({settings: {ebi}}) {
    return `${ebi.protocol}//${ebi.hostname}:${ebi.port}${ebi.root}`;
  },
  fetchOptions,
})(EndpointSettings);

const IPScanEndpointSettings = loadData({
  getUrl({settings: {ipScan}}) {
    return (
      `${ipScan.protocol}//${ipScan.hostname}:${ipScan.port}${ipScan.root}`
    );
  },
  fetchOptions,
})(EndpointSettings);

const Settings = (
  {
    settings: {
      pagination = {}, ui = {}, cache = {}, api = {}, ebi = {}, ipScan = {},
    },
    changeSettings,
    resetSettings,
  }
) => (
  <main onChange={changeSettings}>
    <h3>Settings</h3>
    <PaginationSettings
      pagination={pagination}
      handleChange={changeSettings}
    />
    <UISettings ui={ui} handleChange={changeSettings} />
    <CacheSettings cache={cache} handleChange={changeSettings} />
    <APIEndpointSettings
      handleChange={changeSettings}
      category="api"
      endpointDetails={api}
    >
      API Settings
    </APIEndpointSettings>
    <EBIEndpointSettings
      handleChange={changeSettings}
      category="ebi"
      endpointDetails={ebi}
    >
      EBI Search Settings
    </EBIEndpointSettings>
    <IPScanEndpointSettings
      handleChange={changeSettings}
      category="ipScan"
      endpointDetails={ipScan}
    >
      InterProScan Settings
    </IPScanEndpointSettings>
    <button onClick={resetSettings} className={f('button')}>
      Reset settings to default values
    </button>
  </main>
);
Settings.propTypes = {
  settings: T.shape({
    pagination: T.object.isRequired,
    ui: T.object.isRequired,
    cache: T.object.isRequired,
    api: T.object.isRequired,
    ebi: T.object.isRequired,
  }).isRequired,
  changeSettings: T.func.isRequired,
  resetSettings: T.func.isRequired,
};

const mapStateToProps = createSelector(
  state => state.settings,
  settings => ({settings})
);

export default connect(
  mapStateToProps,
  {changeSettings, resetSettings}
)(Settings);
