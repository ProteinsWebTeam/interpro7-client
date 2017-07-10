/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

import { goToNewLocation } from 'actions/creators';

import f from 'styles/foundation';

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

  _handleSelection = ({ target: { value } }) => {
    this.props.goToNewLocation({
      ...this.props.location,
      search: {
        ...this.props.location.search,
        experiment_type: value === 'ALL' ? undefined : value,
      },
    });
  };

  render() {
    const { data: { loading, payload }, location: { search } } = this.props;
    const types = Object.entries(loading ? {} : payload).sort(
      ([, a], [, b]) => b - a
    );
    if (!loading) {
      types.unshift(['ALL', NaN]);
    }
    return (
      <div style={{ overflowX: 'hidden' }}>
        {types.map(([type, count]) =>
          <div key={type} className={f('column')}>
            <label className={f('row', 'align-middle')}>
              <input
                type="radio"
                name="experiment_type"
                value={type}
                onChange={this._handleSelection}
                checked={
                  (!search.experiment_type && type === 'ALL') ||
                  search.experiment_type === type
                }
                style={{ margin: '0.25em' }}
              />
              <span>
                {type}
              </span>
              <NumberLabel value={count} />
            </label>
          </div>
        )}
      </div>
    );
  }
}

const getUrlFor = createSelector(
  state => state.settings.api,
  state => state.newLocation.description,
  state => state.newLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const { experiment_type, search: _, ..._search } = search;
    // add to search
    _search.group_by = 'experiment_type';
    // build URL
    return `${protocol}//${hostname}:${port}${root}${description2path(
      description
    )}?${qsStringify(_search)}`;
  }
);

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({ location })
);

export default connect(mapStateToProps, { goToNewLocation })(
  loadData(getUrlFor)(ExperimentTypeFilter)
);
