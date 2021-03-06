/* global gtag: false */

import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import uniqueId from 'utils/cheap-unique-id';
import cancelable from 'utils/cancelable';
import {
  dataProgressInfo,
  dataProgressUnload,
  addToast,
} from 'actions/creators';

import extractParams from './extract-params';
import getFetch from './getFetch';

import { UnconnectedErrorBoundary } from 'wrappers/ErrorBoundary';

const TIMEOUT = 408;
const MS = 1000;

const mapStateToState = createSelector(
  (state) => state,
  (appState) => ({ appState }),
);

const newData = (url) => ({
  loading: !!url,
  progress: 0,
  ok: true,
  status: null,
  payload: null,
  url,
});

const loadData = (params) => {
  const {
    getUrl,
    fetchOptions,
    propNamespace,
    weight,
    mapStateToProps,
    mapDispatchToProps,
  } = extractParams(params);
  const fetchFun = getFetch(fetchOptions);

  return (Wrapped) => {
    class DataWrapper extends PureComponent {
      static displayName = `loadData(${Wrapped.displayName || Wrapped.name})`;

      static propTypes = {
        dataProgressInfo: T.func.isRequired,
        dataProgressUnload: T.func.isRequired,
        addToast: T.func.isRequired,
        appState: T.object.isRequired,
      };

      constructor(props) {
        super(props);

        // Identify this specific data loader
        this._id = uniqueId('data-loader');

        // Initialize state
        const url = getUrl(props.appState, props);
        this.state = {
          url,
          data: newData(url),
          staleData: null,
          retries: 0,
        };
      }

      static getDerivedStateFromProps(nextProps, prevState) {
        // get potential new url in state according to props
        const url = getUrl(nextProps.appState, nextProps);
        // if it's the same, don't update the state
        if (prevState.url === url) return null;
        // otherwise, update url in state, and create new data object in state
        return { data: newData(url), url };
      }

      componentDidMount() {
        // start loading data on mount
        this._load(this.state.url);
      }

      componentDidUpdate(prevProps, prevState) {
        // if the url has changed
        if (
          prevState.url !== this.state.url ||
          prevState.retries !== this.state.retries
        ) {
          // cancel current request
          this._cancel();
          // and start new one
          this._load(this.state.url);
        }
      }

      // cancel current request on unmount
      componentWillUnmount() {
        this._cancel();
        if (this.timeoutID) {
          clearTimeout(this.timeoutID);
        }
      }

      _cancel = () => {
        if (this._request) this._request.cancel();
        this.props.dataProgressUnload(this._id);
      };

      _progress = (progress /*: number */) => {
        this.setState(({ data }) => ({ data: { ...data, progress } }));
        this.props.dataProgressInfo(this._id, progress, weight);
      };

      _load = async (url /*: ?string */) => {
        if (!url) {
          this.setState({
            staleData: {
              ...this.state.data,
            },
          });
          return;
        }
        // Progress: 0
        this.props.dataProgressInfo(this._id, 0, weight);
        this._request = cancelable((signal) =>
          fetchFun(
            url,
            { ...fetchOptions, signal },
            this._progress,
            this.props.addToast,
          ),
        );
        // We keep a hold on *this* request, because it might change
        const request = this._request;
        try {
          const response = await request.promise;
          // Analytics
          gtag('event', 'data', {
            event_category: 'data',
            event_response: response.status,
            event_label: url,
            // Custom Metric in google analytics as metrics1: From Client Cache
            event_clientcache: response.headers.has('Client-Cache') ? 1 : 0,
            // Custom Metric in google analytics as metrics1: From Server Cache
            event_cache: response.headers.has('Cached') ? 1 : 0,
          });
          // We have a response 🎉 set it into the local state
          this.setState(({ data }) => {
            const nextData = {
              ...data,
              ...response,
              progress: 1,
              loading: false,
            };
            return { data: nextData, staleData: nextData };
          });
          // Progress: 1
          this.props.dataProgressInfo(this._id, 1, weight);

          const msToRetry =
            this.props.appState.settings.navigation.secondsToRetry * MS;
          // Schedulling to retry because we got a 408
          if (response.status === TIMEOUT) {
            this.timeoutID = setTimeout(() => {
              console.log('Retrying the Timed out query');
              this.setState({ retries: this.state.retries + 1 });
            }, msToRetry);
          }
        } catch (error) {
          // If request has been canceled, it means we did it, on purpose, so
          // just ignore, otherwise it's a real error
          if (!request.canceled) {
            // we have a problem, something bad happened
            // Analytics
            gtag('event', 'error', {
              event_category: 'data',
              event_status: 'fail',
              event_label: url,
              // Custom Metric in google analytics as metrics3: Is Client Online
              event_online: window.navigator.onLine ? 1 : 0,
            });
            this.setState(({ data }) => ({
              data: { ...data, loading: false, progress: 1, ok: false, error },
            }));
            // Progress: 1
            this.props.dataProgressInfo(this._id, 1, weight);
          }
        }
      };

      render() {
        const {
          // props to be removed
          dataProgressInfo,
          dataProgressUnload,
          appState,
          // rest of props, to be passed down
          ...rest
        } = this.props;
        const passedProps = {
          ...rest,
          [`data${propNamespace}`]: this.state.staleData || this.state.data,
          [`isStale${propNamespace}`]: this.state.staleData !== this.state.data,
        };
        // The correction below is needed for MS Edge
        if (
          this.state.data &&
          !this.state.data.loading &&
          this.state.data.url === this.state.url
        )
          passedProps[`isStale${propNamespace}`] = false;
        return (
          <UnconnectedErrorBoundary customLocation={appState.customLocation}>
            <Wrapped
              {...passedProps}
              {...(mapStateToProps(appState, passedProps) || {})}
            />
          </UnconnectedErrorBoundary>
        );
      }
    }

    return connect(mapStateToState, {
      dataProgressInfo,
      dataProgressUnload,
      addToast,
      ...mapDispatchToProps,
    })(DataWrapper);
  };
};

export default loadData;
