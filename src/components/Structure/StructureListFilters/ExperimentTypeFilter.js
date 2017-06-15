/* eslint-disable no-param-reassign */
import React, {Component} from 'react';
import T from 'prop-types';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToNewLocation} from 'actions/creators';

class ExperimentTypeFilter extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    goToNewLocation: T.func.isRequired,
    location: T.shape({
      search: T.object.isRequired,
    }).isRequired,
  };

  _handleSelection = ({target: {value}}) => {
    this.props.goToNewLocation({
      ...this.props.location,
      search: {
        ...this.props.location.search,
        experiment_type: value === 'ALL' ? null : value,
      },
    });
  };

  render() {
    const {data: {loading, payload}, location: {search}} = this.props;
    const types = Object.entries(loading ? {} : payload)
      .sort(([, a], [, b]) => b - a);
    if (!loading){
      types.unshift(['ALL', 'N/A']);
    }
    return (
      <div style={{overflowX: 'hidden'}}>
        {
          types.map(([type, count]) => (
            <div key={type}>
              <label>
                <input
                  type="radio"
                  name="experiment_type"
                  value={type}
                  onChange={this._handleSelection}
                  checked={
                    (!search.experiment_type && type === 'ALL') ||
                    search.experiment_type === type
                  }
                /> {type} <small> ({count})</small>
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
        if (v !== 'experiment_type' && v !== 'search' && search[v]) {
          acc.push(`${v}=${search[v]}`);
        }
        return acc;
      }, []);
    parameters.push('group_by=experiment_type');
    return resolve(
      format({protocol, hostname, port, pathname: root}),
      `${(root + pathname)}?${parameters.join('&')}`,
    );
  }
);

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({location}),
);

export default connect(mapStateToProps, {goToNewLocation})(
  loadData(getUrlFor)(ExperimentTypeFilter)
);

