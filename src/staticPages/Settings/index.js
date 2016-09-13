import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';

import {changeSettings, resetSettings} from 'actions/creators';

import f from 'styles/foundation';

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

const CacheSettings = (/* {cache, handleChange}*/) => (
  <form data-category="cache">
    <h4>Cache settings</h4>
  </form>
);
CacheSettings.propTypes = {
  cache: T.object.isRequired,
  handleChange: T.func.isRequired,
};

const APISettings = ({api, handleChange}) => (
  <form data-category="api">
    <h4>API settings</h4>
    <div className={f('row')}>
      <div className={f('medium-4', 'columns')}>
        <label>
          Hostname:
          <input
            type="text"
            value={api.hostname}
            name="hostname"
            onChange={handleChange}
          />
        </label>
      </div>
      <div className={f('medium-4', 'columns')}>
        <label>
          Port:
          <input
            type="number"
            min="1"
            value={api.port}
            name="port"
            onChange={handleChange}
          />
        </label>
      </div>
      <div className={f('medium-4', 'columns')}>
        <label>
          Root:
          <input
            type="text"
            value={api.root}
            name="root"
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  </form>
);
APISettings.propTypes = {
  api: T.object.isRequired,
  handleChange: T.func.isRequired,
};


const Settings = (
  {
    settings: {pagination = {}, ui = {}, cache = {}, api = {}},
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
    <APISettings api={api} handleChange={changeSettings} />
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
  }).isRequired,
  changeSettings: T.func.isRequired,
  resetSettings: T.func.isRequired,
};

export default connect(
  ({settings}) => ({settings}),
  {changeSettings, resetSettings}
)(Settings);
