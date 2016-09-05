import React, {Component, PropTypes as T} from 'react';
import {connect} from 'react-redux';
import {cachedFetchJSON} from 'utils/cachedFetch';

import Error from 'components/Error';
import Loading from 'components/Loading';

// const defaultQuery = {
//   page: 1,
//   page_size: 10,
// };

const cleanURL = (url/*: string*/) => (
  url.trim().replace(/^\/*/, '').replace(/\/$/, '')
);

const apiStringFromObject = ({hostname, port, root}) => (
  cleanURL(`${hostname}:${port}${root}`)
);

const stateSelector = ({settings: {pagination: {pageSize}, api}}) => (
  {defaultPageSize: pageSize, api: apiStringFromObject(api)}
);

const loader = (config = {}) => (Composed/*: React.Element */) => {
  class Loader extends Component {
    static propTypes = {
      root: T.string,
      location: T.object,
      defaultPageSize: T.number.isRequired,
      api: T.string.isRequired,
    };
    static displayName = `Loader(${Composed.displayName || Composed.name})`;

    state = {data: null, loading: false};

    componentDidMount() {
      this.fetch(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this.fetch(nextProps);
    }

    componentWillUnmount() {
      this.cancel = true;
    }

    async fetch(
      {location, defaultPageSize}/*: {
        location: {pathname: string, query: ?Object},
        defaultPageSize: number
      }*/
    ) {
      const url = cleanURL(config.main || location.pathname);
      try {
        const queryString = Object.entries({
          page: 1, page_size: defaultPageSize, ...location.query,
        }).reduce((prev, [key, value]) => `${prev}&${key}=${value}`, '')
          .slice(1);
        this.setState({loading: true});
        const data = await cachedFetchJSON(
          `${
            location.protocol || 'http:'
          }//${this.props.api}/${url}/?${queryString}`
        );
        if (this.cancel) return;
        console.log(data);
        this.setState({data, loading: false});
      } catch (err) {
        console.error(err);
        this.setState({data: {err}, loading: false});
      }
    }

    render() {
      const {data, loading} = this.state;
      if (data && !loading) {
        const err = data.Error || data.error || data.err;
        if (err) {
          return <Error error={err} />;
        }
        return <Composed {...this.props} data={data} />;
      }
      return <Loading />;
    }
  }

  return connect(stateSelector)(Loader);
};

export default loader;
