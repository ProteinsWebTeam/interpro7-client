import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import uniqueId from 'utils/cheapUniqueId';
import cancelable from 'utils/cancelable';
import { dataProgressInfo, dataProgressUnload } from 'actions/creators';

import extractParams from './extract-params';
import getFetch from './getFetch';
// import { subscribe, unsubscribe } from './subscriptions';

import ErrorBoundary from 'wrappers/ErrorBoundary';

const mapStateToProps = createSelector(
  state => state,
  appState => ({ appState }),
);

const newData = url => ({
  loading: true,
  progress: 0,
  ok: true,
  status: null,
  payload: null,
  url,
});

const loadData = params => {
  const { getUrl, fetchOptions, propNamespace, weight } = extractParams(params);
  const fetchFun = getFetch(fetchOptions);

  return Wrapped => {
    class DataWrapper extends PureComponent {
      static displayName = `loadData(${Wrapped.displayName || Wrapped.name})`;

      static propTypes = {
        dataProgressInfo: T.func.isRequired,
        dataProgressUnload: T.func.isRequired,
        appState: T.object.isRequired,
      };

      static getDerivedStateFromProps(nextProps) {
        console.log('getDerivedStateFromProps');
        return {
          url: getUrl(nextProps.appState),
        };
      }

      constructor(props) {
        console.log('constructor');
        super(props);

        this._id = uniqueId('data-loader');

        const url = getUrl(props.appState);
        this.state = {
          url,
          data: newData(url),
          staleData: null,
        };
      }

      componentDidMount() {
        console.log('componentDidMount');
        if (this.state.url) this._load(this.state.url);
      }

      componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate');
        if (prevState.url !== this.state.url) {
          this._cancel();
          if (this.state.url) this._load(this.state.url);
        }
      }

      componentWillUnmount() {
        console.log('componentWillUnmount');
        this._cancel();
        this.props.dataProgressUnload(this._id);
      }

      _cancel = () => {
        if (this._request) this._request.cancel();
      };

      _progress = (progress /*: number */) => {
        this.setState(({ data }) => ({ data: { ...data, progress } }));
        this.props.dataProgressInfo(this._id, progress, weight);
        console.log(`progress: ${progress}`);
      };

      _load = async (url /*: string */) => {
        this._request = cancelable(signal =>
          fetchFun(url, { ...fetchOptions, signal }, this._progress),
        );
        // We keep a hold on *this* request, because it might change
        const request = this._request;
        try {
          const response = await request.promise;
          this.setState(({ data }) => {
            const nextData = {
              ...data,
              ...response,
              progress: 1,
              loading: false,
            };
            return { data: nextData, staleData: nextData };
          });
          this.props.dataProgressInfo(this._id, 1, weight);
        } catch (error) {
          if (!request.canceled) {
            // we have a problem, something bad happened
            console.error(error);
            this.setState(({ data }) => ({
              data: { ...data, loading: false, progress: 1, ok: false },
            }));
            this.props.dataProgressInfo(this._id, 1, weight);
          }
        }
      };

      render() {
        console.log('render');
        const { appState, ...rest } = this.props;
        const passedProps = {
          ...rest,
          [`data${propNamespace}`]: this.state.staleData || this.state.data,
          [`isStale${propNamespace}`]: this.state.staleData !== this.state.data,
        };
        return (
          <ErrorBoundary>
            <Wrapped {...passedProps} />
          </ErrorBoundary>
        );
      }
    }

    return connect(mapStateToProps, { dataProgressInfo, dataProgressUnload })(
      DataWrapper,
    );
  };
};

export default loadData;
