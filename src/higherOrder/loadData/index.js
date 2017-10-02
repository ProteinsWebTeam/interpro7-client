import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import cancelable from 'utils/cancelable';
import {
  loadingData,
  loadedData,
  progressData,
  unloadingData,
  failedLoadingData,
} from 'actions/creators';
import { alreadyLoadingError } from 'reducers/data';

import extractParams from './extractParams';
import getFetch from './getFetch';

import ErrorBoundary from 'wrappers/ErrorBoundary';

const mapStateToProps = getUrl =>
  createSelector(
    state => state,
    state => state.data[getUrl(state)] || {},
    (appState, data) => ({ appState, data }),
  );
// const getBaseURL = url => (url ? url.slice(0, url.indexOf('?')) : '');

// eslint-disable-next-line max-params
const load = (
  loadingData,
  loadedData,
  progressData,
  unloadingData,
  failedLoadingData,
  fetchFun,
  fetchOptions,
) => key => {
  try {
    loadingData(key);
  } catch (err) {
    if (err.message !== alreadyLoadingError) {
      console.warn(err);
    }
    return cancelable(Promise.resolve());
  }
  const onProgress = progress => progressData(key, progress);
  // Starts the fetch
  const c = cancelable(fetchFun(key, fetchOptions, onProgress));
  // Eventually changes the state according to response
  c.promise.then(
    response => loadedData(key, response),
    error => (error.canceled ? unloadingData : failedLoadingData)(key, error),
  );
  return c;
};

const loadData = params => {
  const { getUrl, fetchOptions, propNamespace } = extractParams(params);
  const fetchFun = getFetch(fetchOptions);

  return (Wrapped /*: ReactClass<*> */) => {
    class DataWrapper extends PureComponent {
      static displayName = `loadData(${Wrapped.displayName || Wrapped.name})`;

      static propTypes = {
        appState: T.object.isRequired,
        loadingData: T.func.isRequired,
        loadedData: T.func.isRequired,
        progressData: T.func.isRequired,
        failedLoadingData: T.func.isRequired,
        unloadingData: T.func.isRequired,
        data: T.shape({
          loading: T.bool,
          progress: T.number,
          payload: T.any,
          url: T.string,
          status: T.number,
          ok: T.boolean,
        }),
      };

      constructor(props) {
        super(props);
        this.state = { staleData: props.data };
        this._url = '';
        // TODO: _avoidStaleData has been removed(29/09/2017), delete commented lines
        // if this change hasn't create any problems.
        // this._avoidStaleData = true;
        this._load = null;
      }

      componentWillMount() {
        const {
          appState,
          data,
          loadingData,
          loadedData,
          progressData,
          failedLoadingData,
          unloadingData,
        } = this.props;
        // (stored in `key` because `this._url` might change)
        const key = (this._url = getUrl(appState));
        if (!this._load) {
          this._load = load(
            loadingData,
            loadedData,
            progressData,
            unloadingData,
            failedLoadingData,
            fetchFun,
            fetchOptions,
          );
        }

        // If data is already there, or loading, don't do anything
        if (data.loading || data.payload) return;
        // Key is the URL to fetch
        // Changes redux state
        this._cancelableFetch = this._load(key);
      }

      componentWillReceiveProps({ data: nextData }) {
        if (
          !nextData.loading &&
          nextData.payload &&
          nextData.payload !== this.state.staleData.payload
        ) {
          this.setState({ staleData: nextData });
        }
      }

      componentWillUpdate({
        appState: nextAppState,
        loadingData,
        loadedData,
        failedLoadingData,
        unloadingData,
        data,
      }) {
        // this._avoidStaleData =
        //   getBaseURL(this._url) !== getBaseURL(getUrl(nextAppState));

        // Same location, no need to reload data
        if (
          nextAppState.newLocation === this.props.appState.newLocation &&
          nextAppState.settings === this.props.appState.settings
        ) {
          return;
        }

        // If data is already there, or loading, don't do anything
        if (data.loading || data.payload) return;
        // New location, cancel previous fetch
        // (if still running, otherwise won't do anything)
        if (this._cancelableFetch) this._cancelableFetch.cancel();
        // Unload previous data
        unloadingData(this._url);
        // Key is the new URL to fetch
        // (stored in `key` because `this._url` might change)

        const key = (this._url = getUrl(nextAppState));
        if (!this._load) {
          this._load = load(
            loadingData,
            loadedData,
            unloadingData,
            failedLoadingData,
            fetchFun,
            fetchOptions,
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
        const { staleData } = this.state;
        const {
          // Remove from props
          appState,
          loadingData,
          loadedData,
          failedLoadingData,
          // Keep, to pass on
          data,
          ...rest
        } = this.props;
        // TODO: remove next line if nothing breaks because of it
        // const data = {...dataFromProps};// maybe useful?..
        if (typeof data.loading === 'undefined') data.loading = true;
        // const useStaleData =
        //   !this._avoidStaleData && data.loading && staleData.payload;
        const useStaleData = data.loading && staleData.payload;
        if (!data.loading) {
          this._url = getUrl(appState);
        }
        const passedProps = {
          ...rest,
          [`data${propNamespace}`]: useStaleData ? staleData : data,
          [`isStale${propNamespace}`]: !!useStaleData,
        };
        return (
          <ErrorBoundary>
            <Wrapped {...passedProps} />
          </ErrorBoundary>
        );
      }
    }

    return connect(mapStateToProps(getUrl), {
      loadingData,
      loadedData,
      progressData,
      unloadingData,
      failedLoadingData,
    })(DataWrapper);
  };
};

export default loadData;
