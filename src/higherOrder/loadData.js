import React, {Component, PropTypes as T} from 'react';
import {connect} from 'react-redux';
import lodashGet from 'lodash-es/get';

import {cachedFetchJSON, cachedFetchText, cachedFetch} from 'utils/cachedFetch';
import cancelable from 'utils/cancelable';
import {
  loadingData, loadedData, unloadingData, failedLoadingData,
} from 'actions/creators';

const _SearchParamsToURL = search => search ?
  Object.entries(search)
    .reduce((acc, val) => acc + (val[1] ? `&${val[0]}=${val[1]}` : ''), '')
    .slice(1) : '';

// Assumes that the default would be to get data from the API, according to
// current pathname
const defaultGetUrl = key => ({
    settings: {[key]: {protocol, hostname, port, root}, pagination},
    location: {pathname, search},
  }) => {
  const s = search || {};
  s.page_size = s.page_size || pagination.pageSize;
  return `${protocol}//${hostname}:${port}${root}${pathname}?${
    _SearchParamsToURL(s)
  }`;
};

const getFetch = ({method, responseType}) => {
  if (responseType === 'text') return cachedFetchText;
  if (method !== 'HEAD') return cachedFetchJSON;
  return (...args) => cachedFetch(...args).then(r => r.ok);
};

const mapStateToProps = getUrl => state => ({
  appState: state,
  data: state.data[getUrl(state)] || {},
});
const getBaseURL = url => url.slice(0, url.indexOf('?'));

// getUrl
const defaultGetUrlForApi = defaultGetUrl('api');
const extractGetUrl = (getUrl = defaultGetUrlForApi) => {
  if (typeof getUrl === 'string') {
    return defaultGetUrl(getUrl);
  }
  return getUrl;
};
// selector
const defaultSelector = payload => payload;
const extractSelector = (selector = defaultSelector) => {
  if (typeof selector === 'string') {
    return payload => lodashGet(payload, selector);
  }
  return selector;
};
//
const extractParams = params => {
  const extracted = {
    getUrl: defaultGetUrlForApi,
    fetchOptions: {},
    selector: defaultSelector,
  };
  if (!params) return extracted;
  if (typeof params !== 'object') {
    extracted.getUrl = (
      typeof params === 'string' ? defaultGetUrl(params) : params
    );
    return extracted;
  }
  extracted.getUrl = extractGetUrl(params.getUrl);
  extracted.fetchOptions = params.fetchOptions || {};
  extracted.selector = extractSelector(params.selector);
  return extracted;
};
const loadData = params => {
  const {getUrl, fetchOptions, selector} = extractParams(params);
  const fetchFun = getFetch(fetchOptions);

  return (Wrapped/*: ReactClass<*> */) => {
    class DataWrapper extends Component {
      static propTypes = {
        appState: T.object.isRequired,
        loadingData: T.func.isRequired,
        loadedData: T.func.isRequired,
        failedLoadingData: T.func.isRequired,
        unloadingData: T.func.isRequired,
        data: T.shape({
          loading: T.bool,
          payload: T.any,
          status: T.number,
        }),
      };

      constructor(props) {
        super(props);
        this.state = {
          staleData: props.data,
        };
        this._url = '';
        this.avoidStaleData = true;
      }

      componentWillMount() {
        const {
          loadingData, loadedData, failedLoadingData, appState, data,
        } = this.props;
        // (stored in `key` because `this._url` might change)
        const key = this._url = getUrl(appState);

        // If data is already there, or loading, don't do anything
        if (data.loading || data.payload) return;
        // Key is the URL to fetch
        // Changes redux state
        loadingData(key);
        // Starts the fetch
        this._cancelableFetch = cancelable(fetchFun(key, fetchOptions));
        // Eventually changes the state according to response
        this._cancelableFetch.promise.then(
          response => loadedData(key, response, selector),
          error => failedLoadingData(key, error)
        );
      }

      componentWillReceiveProps({data: nextData}) {
        if (
          !nextData.loading && nextData.payload &&
          nextData.payload !== this.state.staleData.payload
        ) {
          this.setState({staleData: nextData});
        }
      }

      componentWillUpdate({
        appState: nextAppState,
        loadingData, loadedData, failedLoadingData, unloadingData, data,
      }) {
        this.avoidStaleData = (
          getBaseURL(this._url) !== getBaseURL(getUrl(nextAppState))
        );

        // Same location, no need to reload data
        if (nextAppState.location === this.props.appState.location) return;
        // If data is already there, or loading, don't do anything
        if (data.loading || data.payload) return;
        // New location, cancel previous fetch
        // (if still running, otherwise won't do anything)
        if (this._cancelableFetch) this._cancelableFetch.cancel();
        // Unload previous data
        unloadingData(this._url);
        // Key is the new URL to fetch
        // (stored in `key` because `this._url` might change)

        const key = this._url = getUrl(nextAppState);
        loadingData(key);
        this._cancelableFetch = cancelable(fetchFun(key, fetchOptions));
        this._cancelableFetch.promise.then(
          payload => loadedData(key, payload, selector),
          error => failedLoadingData(key, error),
        );
      }

      componentWillUnmount() {
        // Unload data
        this.props.unloadingData(this._url);
        // Cancel previous fetch
        // (if still running, otherwise won't do anything)
        if (this._cancelableFetch) this._cancelableFetch.cancel();
        this._url = null;
      }

      render() {
        const {
          // Remove from props
          appState, loadingData, loadedData, failedLoadingData,
          // Keep, to pass on
          data,
          ...props
        } = this.props;

        if (typeof data.loading === 'undefined') {
          data.loading = true;
        }
        let _data = data;
        let isStale = false;
        if (
          !this.avoidStaleData && _data.loading && this.state.staleData.payload
        ) {
          _data = this.state.staleData;
          isStale = true;
        }
        if (!_data.loading) {
          this._url = getUrl(appState);
        }
        return <Wrapped {...props} data={_data} isStale={isStale}/>;
      }
    }

    return connect(
      mapStateToProps(getUrl),
      {loadingData, loadedData, unloadingData, failedLoadingData}
    )(DataWrapper);
  };
};

export default loadData;
export const searchParamsToURL = _SearchParamsToURL;
