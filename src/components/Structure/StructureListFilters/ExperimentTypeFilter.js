// @flow
/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

class ExperimentTypeFilter extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
  };

  _handleSelection = ({ target: { value } }) => {
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      search: {
        ...this.props.customLocation.search,
        experiment_type: value === 'All' ? undefined : value,
        page: undefined,
      },
    });
  };

  render() {
    const {
      data: { loading, payload },
      customLocation: { description, search },
    } = this.props;
    if (
      (Object.entries(description).find(([_key, value]) => value.isFilter) ||
        [])[0]
    )
      return <div>Not available.</div>;
    const types = Object.entries(loading ? {} : payload).sort(
      ([, a], [, b]) => b - a,
    );
    if (!loading) {
      types.unshift(['All', NaN]);
    }
    return (
      <div style={{ overflowX: 'hidden' }}>
        {types.map(([type, count]) => (
          <div key={type} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="experiment_type"
                value={type}
                onChange={this._handleSelection}
                checked={
                  (!search.experiment_type && type === 'All') ||
                  search.experiment_type === type
                }
                style={{ margin: '0.25em' }}
              />
              <span>{type}</span>
              {typeof count === 'undefined' || isNaN(count) ? null : (
                <NumberLabel value={count} className={f('filter-label')} />
              )}
            </label>
          </div>
        ))}
      </div>
    );
  }
}

const getUrlFor = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    // eslint-disable-next-line camelcase
    const { experiment_type, search: _, ..._search } = search;
    // add to search
    _search.group_by = 'experiment_type';
    // build URL
    return `${protocol}//${hostname}:${port}${root}${descriptionToPath(
      description,
    )}?${qsStringify(_search)}`;
  },
);

const mapStateToProps = createSelector(
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  loadData(getUrlFor)(ExperimentTypeFilter),
);
