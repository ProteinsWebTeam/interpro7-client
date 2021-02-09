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

const TaxonomyOption = ({
  checked,
  taxId,
  count,
  title,
  isStale,
  onChange,
  loading,
}) => (
  <label className={f('radio-btn-label', { checked })}>
    <input
      type="radio"
      name="entry_type"
      value={taxId}
      disabled={isStale}
      className={f('radio-btn')}
      onChange={onChange}
      checked={checked}
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
);
TaxonomyOption.propTypes = {
  checked: T.bool,
  taxId: T.string.isRequired,
  count: T.number,
  title: T.string,
  isStale: T.bool,
  onChange: T.func,
  loading: T.bool,
};

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
  state = {
    taxes: [],
    extraFeature: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data || nextProps.data.loading) return prevState;
    const {
      data: { loading, payload },
      isStale,
      customLocation: {
        description: {
          taxonomy: { accession: acc, isFilter },
        },
      },
    } = nextProps;
    const taxes = Object.entries(
      getPayloadOrEmpty(payload, loading, isStale),
    ).sort(([, { value: a }], [, { value: b }]) => b - a);
    const accession = isFilter ? acc : null;
    if (!loading) {
      taxes.unshift(['ALL', NaN]);
    }
    const isMissingInTaxes =
      accession !== null && !taxes.find(([tax]) => tax === accession);
    return {
      taxes,
      extraFeature: isMissingInTaxes ? accession : prevState.extraFeature,
    };
  }
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
      data: { loading },
      isStale,
      customLocation: {
        description: {
          taxonomy: { accession: acc, isFilter },
        },
      },
    } = this.props;
    const accession = isFilter ? acc : null;
    return (
      <div
        style={{ overflowX: 'hidden' }}
        className={f('list-taxonomy', { stale: isStale })}
      >
        {this.state.extraFeature && (
          <ExtraTaxonomyOption
            taxId={this.state.extraFeature}
            checked={this.state.extraFeature === accession}
            onChange={this._handleSelection}
          />
        )}
        <div className={f('column')}>
          {this.state.taxes.map(([taxId, { value: count, title }]) => (
            <TaxonomyOption
              key={taxId}
              taxId={taxId}
              checked={(!accession && taxId === 'ALL') || accession === taxId}
              loading={loading}
              count={count}
              title={title}
              isStale={isStale}
              onChange={this._handleSelection}
            />
          ))}
        </div>
      </div>
    );
  }
}
const _ExtraTaxonomyOption = ({ taxId, checked, data, onChange }) => (
  <TaxonomyOption
    taxId={taxId}
    checked={checked}
    title={data?.payload?.metadata?.name?.name || taxId}
    onChange={onChange}
  />
);
_ExtraTaxonomyOption.propTypes = {
  taxId: T.string.isRequired,
  checked: T.bool,
  data: T.shape({
    payload: T.any,
  }).isRequired,
  onChange: T.func,
};
const getUrlForMetadata = createSelector(
  (state) => state.settings.api,
  (_, props) => props.taxId,
  ({ protocol, hostname, port, root }, accession) =>
    format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: 'taxonomy' },
          taxonomy: { db: 'uniprot', accession },
        }),
    }),
);
const ExtraTaxonomyOption = loadData(getUrlForMetadata)(_ExtraTaxonomyOption);

const getUrlFor = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
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
  (customLocation) => ({ customLocation }),
);

export default loadData({
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(TaxonomyFilter);
