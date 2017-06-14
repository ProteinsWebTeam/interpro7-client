import React, {Component} from 'react';
import T from 'prop-types';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToNewLocation} from 'actions/creators';


class IntegratedFilter extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    goToNewLocation: T.func.isRequired,
    location: T.shape({
      description: T.object,
    }).isRequired,
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

  handleSelection = ({target: {value}}) => {
    let path = (this.props.pathname || '')
      .replace('/integrated', '')
      .replace('/unintegrated', '');
    this.setState({value});
    if (value === 'integrated') {
      path = path.replace('/entry', '/entry/integrated');
    } else if (value === 'unintegrated') {
      path = path.replace('/entry', '/entry/unintegrated');
    }
    this.props.goToNewLocation({
      ...this.props.location,
      description: {
        ...this.props.location.description, // FIXME
      },
    });
  };

  render() {
    const {data: {loading, payload}} = this.props;
    const types = loading ? {} : payload;
    if (!loading) types.both = payload.integrated + payload.unintegrated;
    return (
      <div>
        {
          Object.keys(types).sort().map(type => (
            <div key={type}>
              <label>
                <input
                  type="radio"
                  name="interpro_state"
                  value={type}
                  onChange={this._handleSelection}
                  checked={this.state.value === type}
                />
                {type} <small>({types[type]})</small>
              </label>
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
  state => state.newLocation,
  location => ({location}),
);

export default connect(mapStateToProps, {goToNewLocation})(loadData({
  getUrl: getUrlFor,
})(IntegratedFilter));
