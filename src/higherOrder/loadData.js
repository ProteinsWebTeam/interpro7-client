import React, {Component, PropTypes as T} from 'react';
import {connect} from 'react-redux';

import {cachedFetchJSON, cachedFetch} from 'utils/cachedFetch';
import cancelable from 'utils/cancelable';
import {LOADING_DATA, LOADED_DATA, FAILED_LOADING_DATA, UNLOADING_DATA}
  from 'actions/types';

const getFetch = (method/*: string */)/*: function */ => {
  if (method !== 'HEAD') return cachedFetchJSON;
  return (...args) => cachedFetch(...args).then(r => r.ok);
};

const mapStateToProps = getUrl => state => ({
  appState: state,
  data: state.dataMap[getUrl(state)] || {loading: true},
});

const loadData = (
  getUrl/*: (appState: Object) => string */,
  options/*: Object */
) => {
  const fetchFun = getFetch(options && options.method);
  return (Wrapped/*: ReactClass<*> */) => {
    class Wrapper extends Component {
      static propTypes = {
        appState: T.object.isRequired,
        dispatch: T.func.isRequired,
      };

      componentWillMount() {
        const {dispatch, appState} = this.props;
        // Key is the URL to fetch
        // (stored in `key` because `this._url` might change)
        const key = this._url = getUrl(appState);
        // Changes redux state
        dispatch({type: LOADING_DATA, key});
        // Starts the fetch
        this._cancelableFetch = cancelable(fetchFun(key, options));
        // Eventually changes the state according to response
        this._cancelableFetch.promise.then(
          payload => dispatch({type: LOADED_DATA, payload, key}),
          error => dispatch({type: FAILED_LOADING_DATA, error, key})
        );
      }

      async componentWillUpdate({appState: nextAppState, dispatch}) {
        // Same location, no need to reload data
        if (nextAppState.location === this.props.appState.location) return;
        // New location, cancel previous fetch
        // (if still running, otherwise won't do anything)
        this._cancelableFetch.cancel();
        // Unload previous data
        dispatch({type: UNLOADING_DATA, key: this._url});
        // Key is the new URL to fetch
        // (stored in `key` because `this._url` might change)
        const key = this._url = getUrl(nextAppState);
        dispatch({type: LOADING_DATA, key});
        this._cancelableFetch = cancelable(fetchFun(key, options));
        this._cancelableFetch.promise.then(
          payload => dispatch({type: LOADED_DATA, payload, key}),
          error => dispatch({type: FAILED_LOADING_DATA, error, key})
        );
      }

      componentWillUnmount() {
        // Unload data
        this.props.dispatch({type: UNLOADING_DATA, key: this._url});
        // Cancel previous fetch
        // (if still running, otherwise won't do anything)
        this._cancelableFetch.cancel();
        this._url = null;
      }

      render() {
        const {appState: _, dispatch: __, ...props} = this.props;
        return <Wrapped {...props} />;
      }
    };
    return connect(mapStateToProps(getUrl))(Wrapper);
  };
};

export default loadData;
