import React, {Component} from 'react'; import T from 'prop-types';
import {connect} from 'react-redux';

import cancelable from 'utils/cancelable';
import {
  loadingData, loadedData, unloadingData, failedLoadingData,
} from 'actions/creators';

import * as defaults from './defaults';
import extractParams from './extractParams';
import getFetch from './getFetch';

const mapStateToProps = getUrl => state => ({
  appState: state,
  data: state.data[getUrl(state)] || {},
});
const getBaseURL = url => url ? url.slice(0, url.indexOf('?')) : '';

// eslint-disable-next-line max-params
const load = (
  loadingData, loadedData, unloadingData, failedLoadingData, fetchFun, fetchOptions) =>
  (key) => {
    try {
      loadingData(key);
    } catch (err) {
      console.warn(err);
      return cancelable(Promise.resolve());
    }
    // Starts the fetch
    const c = cancelable(fetchFun(key, fetchOptions));
    // Eventually changes the state according to response
    c.promise.then(
      response => loadedData(key, response),
      error => (
        [error.canceled ? unloadingData : failedLoadingData](key, error)
      ),
    );
    return c;
  };

const loadData = params => {
  const {getUrl, fetchOptions, propNamespace} = extractParams(params);
  const fetchFun = getFetch(fetchOptions);

  return (Wrapped/*: ReactClass<*> */) => {
    class DataWrapper extends Component {
      static displayName = `loadData(${Wrapped.displayName || Wrapped.name})`;

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
        this.state = {staleData: props.data};
        this._url = '';
        this._avoidStaleData = true;
        this._load = null;
      }

      componentWillMount() {
        const {
          appState, data,
          loadingData, loadedData, failedLoadingData, unloadingData,
        } = this.props;
        // (stored in `key` because `this._url` might change)
        const key = this._url = getUrl(appState);
        if (!this._load) {
          this._load = load(
            loadingData, loadedData, unloadingData, failedLoadingData,
            fetchFun, fetchOptions
          );
        }

        // If data is already there, or loading, don't do anything
        if (data.loading || data.payload) return;
        // Key is the URL to fetch
        // Changes redux state
        this._cancelableFetch = this._load(key);
      }

      componentWillReceiveProps({data: nextData}) {
        if (
          !nextData.loading && nextData.payload &&
          nextData.payload !== this.state.staleData.payload
        ) {
          this.setState({staleData: nextData});
        }
      }

      // eslint-disable-next-line max-statements
      componentWillUpdate({
        appState: nextAppState,
        loadingData, loadedData, failedLoadingData, unloadingData, data,
      }) {
        this._avoidStaleData = (
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
        if (!this._load) {
          this._load = load(
            loadingData, loadedData, unloadingData, failedLoadingData,
            fetchFun, fetchOptions
          );
        }
        this._cancelableFetch = this._load(key);
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
          data: dataFromProps, ...rest
        } = this.props;
        const data = {...dataFromProps};
        if (typeof data.loading === 'undefined') data.loading = true;
        const useStaleData = (
          !this._avoidStaleData && data.loading && this.state.staleData.payload
        );
        if (!data.loading) {
          this._url = getUrl(appState);
        }
        const passedProps = {
          ...rest,
          [`data${propNamespace}`]: useStaleData ? this.state.staleData : data,
          [`isStale${propNamespace}`]: useStaleData,
        };
        return <Wrapped {...passedProps} />;
      }
    }

    return connect(
      mapStateToProps(getUrl),
      {loadingData, loadedData, unloadingData, failedLoadingData}
    )(DataWrapper);
  };
};

export default loadData;
export const searchParamsToURL = defaults._SearchParamsToURL;
