import React, {Component} from 'react';
import T from 'prop-types';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToLocation} from 'actions/creators';


class IntegratedFilter extends Component {
  static propTypes = {
    dataIntegrated: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    goToLocation: T.func.isRequired,
    pathname: T.string,
    search: T.object,
  };
  constructor(){
    super();
    this.state = {value: null};
  }
  componentWillMount() {
    if (this.props.pathname.indexOf('/unintegrated') > 0) {
      this.setState({value: 'unintegrated'});
    } else if (this.props.pathname.indexOf('/integrated') > 0) {
      this.setState({value: 'integrated'});
    } else {
      this.setState({value: 'both'});
    }
  }
  handleSelection = (option) => {
    let path = this.props.pathname
      .replace('/integrated', '')
      .replace('/unintegrated', '');
    this.setState({value: option});
    if (option === 'integrated') {
      path = path.replace('/entry', '/entry/integrated');
    } else if (option === 'unintegrated') {
      path = path.replace('/entry', '/entry/unintegrated');
    }
    this.props.goToLocation({
      pathname: path,
      search: this.props.search,
    });
  };
  render() {
    const {dataIntegrated: {loading, payload}} = this.props;
    const types = loading ? {} : payload;
    if (!loading) types.both = payload.integrated + payload.unintegrated;
    return (
      <div>

        { Object.keys(types).sort().map((type, i) => (
          <div key={i}>
            <input
              type="radio" name="interpro_state" id={type} value={type}
              onChange={() => this.handleSelection(type)}
              checked={this.state.value === type}
            />
            <label htmlFor={type}>{type} <small>({types[type]})</small></label>
          </div>
        ))
        }
      </div>
    );
  }
}

const getUrlFor = createSelector(
  state => state.settings.api,
  state => state.location,
  ({protocol, hostname, port, root}, {pathname, search}) => {
    const parameters = Object.keys(search)
      .reduce((acc, v) => {
        if (v !== 'search' && search[v]) {
          acc.push(`${v}=${search[v]}`);
        }
        return acc;
      }, []);
    parameters.push('interpro_status');
    return resolve(
      format({protocol, hostname, port, pathname: root}),
      `${(root + pathname)}?${parameters.join('&')}`
        .replace('/integrated', '')
        .replace('/unintegrated', ''),
    );
  }
);

const mapStateToProps = createSelector(
  state => state.location.pathname,
  state => state.location.search,
  (pathname, search) => ({pathname, search})
);

export default connect(mapStateToProps, {goToLocation})(loadData({
  getUrl: getUrlFor,
  propNamespace: 'Integrated',
})(IntegratedFilter));
