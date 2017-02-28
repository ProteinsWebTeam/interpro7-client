import React, {Component, PropTypes as T} from 'react';
import {connect} from 'react-redux';

import {cachedFetchJSON, cachedFetch} from 'utils/cachedFetch';
import cancelable from 'utils/cancelable';
import {
  loadingData, loadedData, unloadingData, failedLoadingData,
} from 'actions/creators';

const searchParamsToURL = search => search ?
  Object.entries(search)
    .reduce((acc, val) => acc + (val[1] ? `&${val[0]}=${val[1]}` : ''), '')
    .slice(1) : '';

// Assumes that the default would be to get data from the API, according to
// current pathname
const defaultGetUrl = key => (
  {settings: {[key]: {protocol, hostname, port, root}}, location: {pathname, search}}
) => `${protocol}//${hostname}:${port}${root}${pathname}?${searchParamsToURL(search)}`;

const getFetch = (method/*: string */)/*: function */ => {
  if (method !== 'HEAD') return cachedFetchJSON;
  return (...args) => cachedFetch(...args).then(r => r.ok);
};

const mapStateToProps = getUrl => state => ({
  appState: state,
  data: state.data[getUrl(state)] || {loading: true},
});

const loadData = (
  getUrl/*: (appState: Object) => string */ = 'api',
  options/*: Object */
) => {
  const _getUrl = (getUrl instanceof Function) ? getUrl : defaultGetUrl(getUrl);
  const fetchFun = getFetch(options && options.method);
  return (Wrapped/*: ReactClass<*> */) => {
    class Wrapper extends Component {
      static propTypes = {
        appState: T.object.isRequired,
        loadingData: T.func.isRequired,
        loadedData: T.func.isRequired,
        failedLoadingData: T.func.isRequired,
        unloadingData: T.func.isRequired,
      };

      componentWillMount() {
        const {
          loadingData, loadedData, failedLoadingData, appState,
        } = this.props;
        // Key is the URL to fetch
        // (stored in `key` because `this._url` might change)
        const key = this._url = _getUrl(appState);
        // Changes redux state
        loadingData(key);
        // Starts the fetch
        this._cancelableFetch = cancelable(fetchFun(key, options));
        // Eventually changes the state according to response
        this._cancelableFetch.promise.then(
          payload => loadedData(key, payload),
          error => failedLoadingData(key, error)
        );
      }

      componentWillUpdate({
        appState: nextAppState,
        loadingData, loadedData, failedLoadingData, unloadingData,
      }) {
        // Same location, no need to reload data
        if (nextAppState.location === this.props.appState.location) return;
        // New location, cancel previous fetch
        // (if still running, otherwise won't do anything)
        this._cancelableFetch.cancel();
        // Unload previous data
        unloadingData(this._url);
        // Key is the new URL to fetch
        // (stored in `key` because `this._url` might change)
        const key = this._url = _getUrl(nextAppState);
        loadingData(key);
        this._cancelableFetch = cancelable(fetchFun(key, options));
        this._cancelableFetch.promise.then(
          payload => loadedData(key, payload),
          error => failedLoadingData(key, error),
        );
      }

      componentWillUnmount() {
        // Unload data
        this.props.unloadingData(this._url);
        // Cancel previous fetch
        // (if still running, otherwise won't do anything)
        this._cancelableFetch.cancel();
        this._url = null;
      }

      render() {
        const {
          // Ignore
          appState: _,
          loadingData: __,
          loadedData: ___,
          failedLoadingData: ____,
          // Keep, to pass on
          ...props
        } = this.props;
        return <Wrapped {...props} />;
      }
    }

    return connect(
      mapStateToProps(_getUrl),
      {loadingData, loadedData, unloadingData, failedLoadingData}
    )(Wrapper);
  };
};

export default loadData;
