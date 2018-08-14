import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberLabel from 'components/NumberLabel';
import Loading from 'components/SimpleCommonComponents/Loading';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

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
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    search: T.object,
  };

  _handleSelection = ({ target: { value } }) => {
    const { page, ...search } = this.props.customLocation.search;
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      description: {
        ...this.props.customLocation.description,
        taxonomy: {
          isFilter: value !== 'ALL',
          db: value === 'ALL' ? null : 'uniprot',
          accession: value === 'ALL' ? null : value,
        },
      },
      search,
    });
  };

  render() {
    if (!this.props.data || this.props.data.loading) return <Loading />;
    const {
      data: { loading, payload },
      customLocation: {
        description: {
          taxonomy: { accession },
        },
      },
    } = this.props;
    const taxes = Object.entries(loading ? {} : payload).sort(
      ([, { value: a }], [, { value: b }]) => b - a,
    );
    if (!loading) {
      taxes.unshift(['ALL', NaN]);
    }
    return (
      <div style={{ overflowX: 'hidden' }} className={f('list-taxonomy')}>
        {taxes.map(([taxId, { value: count, title }]) => (
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
              {taxId === 'ALL' ? <div>All</div> : title}
              {typeof count === 'undefined' || isNaN(count) ? null : (
                <NumberLabel
                  value={count}
                  loading={loading}
                  className={f('filter-label')}
                  abbr
                />
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
    const desc = {
      ...description,
      taxonomy: {
        ...description.taxonomy,
        accession: null,
      },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(desc),
      query: _search,
    });
  },
);

const mapStateToProps = createSelector(
  customLocationSelector,
  customLocation => ({ customLocation }),
);

export default loadData({
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(TaxonomyFilter);
