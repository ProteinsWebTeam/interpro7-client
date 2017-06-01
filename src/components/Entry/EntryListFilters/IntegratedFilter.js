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
      if (this.state.integrated && this.state.unintegrated){
        path = path.replace('/entry', '/entry/unintegrated');
      }
      if (!this.state.integrated && !this.state.unintegrated){
        path = path.replace('/entry', '/entry/integrated');
      }
    }
    if (option === 'unintegrated') {
      if (this.state.integrated && this.state.unintegrated){
        path = path.replace('/entry', '/entry/integrated');
      }
      if (!this.state.integrated && !this.state.unintegrated){
        path = path.replace('/entry', '/entry/unintegrated');
      }
    }
    this.props.goToLocation(path);
  };
  render() {
    const {dataIntegrated: {loading, payload}} = this.props;
    const types = loading ? {} : payload;
    if (!loading) types.both = payload.integrated + payload.unintegrated;
    return (
      <div>

        { Object.keys(types).map((type, i) => (
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
  state => state.location.pathname,
  ({protocol, hostname, port, root}, pathname) => resolve(
    format({protocol, hostname, port, pathname: root}),
    `${(root + pathname)}?interpro_status`
      .replace('/integrated', '')
      .replace('/unintegrated', ''),
  )
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
