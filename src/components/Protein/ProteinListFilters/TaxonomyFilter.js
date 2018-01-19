// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberLabel from 'components/NumberLabel';
import Metadata from 'wrappers/Metadata';
import TaxIdOrName from 'components/Organism/TaxIdOrName';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

class TaxonomyFilter extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    customLocation: T.shape({
      search: T.object.isRequired,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    search: T.object,
  };

  _handleSelection = ({ target: { value } }) => {
    const { goToCustomLocation, customLocation } = this.props;
    goToCustomLocation({
      ...customLocation,
      description: {
        ...customLocation.description,
        organism: {
          isFilter: value !== 'ALL',
          db: value === 'ALL' ? null : 'taxonomy',
          accession: value === 'ALL' ? null : value,
        },
      },
      search: {
        ...customLocation.search,
        page: undefined,
      },
    });
  };

  render() {
    const {
      data: { loading, payload },
      customLocation: { description: { organism: { accession } } },
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
                checked={(!accession && taxId === 'ALL') || accession === taxId}
                style={{ margin: '0.25em' }}
              />
              {taxId === 'ALL' ? (
                <div>All</div>
              ) : (
                <Metadata
                  endpoint="organism"
                  db="taxonomy"
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
  state => state.customLocation.description,
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    // eslint-disable-next-line camelcase
    const { tax_id, search: _, ..._search } = search;
    // add to search
    _search.group_by = 'tax_id';
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: _search,
    });
  },
);

const mapStateToProps = createSelector(
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  loadData({
    getUrl: getUrlFor,
  })(TaxonomyFilter),
);
