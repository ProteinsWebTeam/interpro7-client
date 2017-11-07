import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import NumberLabel from 'components/NumberLabel';
import Metadata from 'wrappers/Metadata';
import TaxIdOrName from 'components/Organism/TaxIdOrName';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

import { goToNewLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

class TaxonomyFilter extends PureComponent {
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
    const { goToNewLocation, location } = this.props;
    goToNewLocation({
      ...location,
      description: {
        ...location.description,
        focusType: value === 'ALL' ? null : 'organism',
        focusDB: value === 'ALL' ? null : 'taxonomy',
        focusAccession: value === 'ALL' ? null : value,
      },
    });
  };

  render() {
    const {
      data: { loading, payload },
      location: { description: { focusAccession } },
    } = this.props;
    const taxes = Object.entries(loading ? {} : payload).sort(
      ([, a], [, b]) => b - a,
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
                  (!focusAccession && taxId === 'ALL') ||
                  focusAccession === taxId
                }
                style={{ margin: '0.25em' }}
              />
              {taxId === 'ALL' ? (
                <div>All</div>
              ) : (
                <Metadata
                  endpoint={'organism'}
                  db={'taxonomy'}
                  accession={taxId === 'ALL' ? 1 : taxId}
                >
                  <TaxIdOrName accession={taxId} element="div" />
                </Metadata>
              )}
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
  state => state.newLocation.description,
  state => state.newLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const { tax_id, search: _, ..._search } = search;
    // add to search
    _search.group_by = 'tax_id';
    // build URL
    return `${protocol}//${hostname}:${port}${root}${description2path(
      description,
    )}?${qsStringify(_search)}`;
  },
);

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({ location }),
);

export default connect(mapStateToProps, { goToNewLocation })(
  loadData({
    getUrl: getUrlFor,
  })(TaxonomyFilter),
);
