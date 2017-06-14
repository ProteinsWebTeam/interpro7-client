/* eslint-disable no-param-reassign */
import React, {Component} from 'react';
import T from 'prop-types';

import {connect} from 'react-redux';
import loadData from 'higherOrder/loadData';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import {goToLocation} from 'actions/creators';


class ExperimentTypeFilter extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    goToLocation: T.func.isRequired,
    pathname: T.string,
    search: T.object,
  };
  handleSelection = (option) => {
    this.props.goToLocation({
      pathname: this.props.pathname,
      search: {
        ...this.props.search,
        experiment_type: option === 'ALL' ? null : option,
      },
    });
  };
  render() {
    const {data: {loading, payload}, search} = this.props;
    const types = loading ? {} : payload;
    if (!loading){
      types.ALL = 'N/A';
    }
    return (
      <div style={{overflowX: 'hidden'}}>
        { Object.keys(types).sort().map((type, i) => (
          <div key={i}>
            <input
              type="radio" name="experiment_type" id={type} value={type}
              onChange={() => this.handleSelection(type)}
              checked={
                (!search.experiment_type && type === 'ALL') ||
                    search.experiment_type === type
              }
            />
            <label htmlFor={type}>
              {type}
              <small> ({types[type]})</small>
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
  state => state.location.pathname,
  state => state.location.search,
  (pathname, search) => ({pathname, search})
);

export default connect(mapStateToProps, {goToLocation})(
  loadData(getUrlFor)(ExperimentTypeFilter)
);

