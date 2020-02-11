import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberComponent from 'components/NumberComponent';
import Loading from 'components/SimpleCommonComponents/Loading';
import { getPayloadOrEmpty } from 'components/FiltersPanel';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';

import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

/*:: type Props = {
  data: {
    loading: boolean,
    payload: any
  },
  isStale: boolean,
  goToCustomLocation: function,
  customLocation: {
    description: Object,
    search: Object
  },
  search: Object
}; */
class TaxonomyFilter extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    isStale: T.bool.isRequired,
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    search: T.object,
  };

  _handleSelection = ({ target: { value } }) => {
    const { page, cursor, ...search } = this.props.customLocation.search;
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
      isStale,
      customLocation: {
        description: {
          taxonomy: { accession: acc, isFilter },
        },
      },
    } = this.props;
    const taxes = Object.entries(
      getPayloadOrEmpty(payload, loading, isStale),
    ).sort(([, { value: a }], [, { value: b }]) => b - a);
    const accession = isFilter ? acc : null;
    if (!loading) {
      taxes.unshift(['ALL', NaN]);
    }
    return (
      <div
        style={{ overflowX: 'hidden' }}
        className={f('list-taxonomy', { stale: isStale })}
      >
        {taxes.map(([taxId, { value: count, title }]) => (
          <div key={taxId} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="entry_type"
                value={taxId}
                disabled={isStale}
                onChange={this._handleSelection}
                checked={(!accession && taxId === 'ALL') || accession === taxId}
                style={{ margin: '0.25em' }}
              />
              {taxId === 'ALL' ? <div>All</div> : title}
              {typeof count === 'undefined' || isNaN(count) ? null : (
                <NumberComponent
                  label
                  loading={loading}
                  className={f('filter-label')}
                  abbr
                >
                  {count}
                </NumberComponent>
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
    const { tax_id, search: _, cursor: __, ..._search } = search;
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
