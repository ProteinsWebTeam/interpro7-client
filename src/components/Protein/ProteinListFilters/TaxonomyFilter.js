import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

import { goToNewLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';
const f = foundationPartial(style);

class TaxonomyFilter extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    location: T.shape({
      search: T.object.isRequired,
    }).isRequired,
    goToNewLocation: T.func.isRequired,
    search: T.object,
  };

  _handleSelection = ({ target: { value } }) => {
    this.props.goToNewLocation({
      ...this.props.location,
      search: {
        ...this.props.location.search,
        tax_id: value === 'ALL' ? undefined : value,
      },
    });
  };

  render() {
    const { data: { loading, payload }, location: { search } } = this.props;
    const taxes = Object.entries(loading ? {} : payload).sort(
      ([, a], [, b]) => b - a
    );
    if (!loading) {
      taxes.unshift(['ALL', NaN]);
    }
    return (
      <div style={{ overflowX: 'hidden' }}>
        {taxes.map(([taxId, count]) => (
          <div key={taxId} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="entry_type"
                value={taxId}
                onChange={this._handleSelection}
                checked={
                  (!search.tax_id && taxId === 'ALL') || search.tax_id === taxId
                }
                style={{ margin: '0.25em' }}
              />
              <span>{taxId}</span>
              <NumberLabel value={count} />
            </label>
          </div>
        ))}
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
    const { tax_id, search: _, ..._search } = search;
    // add to search
    _search.group_by = 'tax_id';
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
  loadData({
    getUrl: getUrlFor,
  })(TaxonomyFilter)
);
