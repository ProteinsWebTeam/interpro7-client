import React, { FormEvent, PureComponent } from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

import Loading from 'components/SimpleCommonComponents/Loading';
import { getPayloadOrEmpty } from 'components/FiltersPanel';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

import cssBinder from 'styles/cssBinder';

import style from 'components/FiltersPanel/style.css';
import TaxonomyOption from './TaxonomyOption';
import ExtraTaxonomyOption from './ExtraTaxonomyOption';

const css = cssBinder(style);

type Props = {
  label?: string;
  goToCustomLocation?: typeof goToCustomLocation;
  customLocation?: InterProLocation;
};
type TaxGroup = {
  value: number;
  title: string;
};
type State = {
  taxes: Array<[string, TaxGroup]>;
  extraFeature: string | null;
};
interface LoadedProps extends Props, LoadDataProps<GroupByPayload<TaxGroup>> {}

class TaxonomyFilter extends PureComponent<LoadedProps, State> {
  state: State = {
    taxes: [],
    extraFeature: null,
  };

  static getDerivedStateFromProps(nextProps: LoadedProps, prevState: State) {
    if (
      !nextProps.data ||
      nextProps.data.loading ||
      !nextProps.customLocation?.description
    )
      return prevState;
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
      getPayloadOrEmpty<GroupByPayload<TaxGroup>, TaxGroup>(
        payload,
        loading,
        isStale,
      ),
    ).sort(([, { value: a }], [, { value: b }]) => b - a);
    const accession = isFilter ? acc : null;
    if (!loading) {
      taxes.unshift(['ALL', { title: 'ALL', value: NaN }]);
    }
    const isMissingInTaxes =
      accession !== null && !taxes.find(([tax]) => tax === accession);
    return {
      taxes,
      extraFeature: isMissingInTaxes ? accession : prevState.extraFeature,
    };
  }
  _handleSelection = ({ target }: FormEvent) => {
    if (!this.props.customLocation) return null;
    const value = (target as HTMLInputElement).value;
    const { page, cursor, ...search } = this.props.customLocation.search;
    this.props.goToCustomLocation?.({
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
    if (!this.props.data || !this.props.customLocation) return null;
    if (this.props.data.loading) return <Loading />;
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
        className={css('list-taxonomy', 'filter', { stale: isStale })}
      >
        {this.state.extraFeature && (
          <ExtraTaxonomyOption
            taxId={this.state.extraFeature}
            checked={this.state.extraFeature === accession}
            onChange={this._handleSelection}
          />
        )}
        <div>
          {this.state.taxes.map(([taxId, { value: count, title }]) => (
            <TaxonomyOption
              key={taxId}
              taxId={taxId}
              checked={(!accession && taxId === 'ALL') || accession === taxId}
              loading={loading}
              count={count}
              title={title}
              isStale={!!isStale}
              onChange={this._handleSelection}
            />
          ))}
        </div>
      </div>
    );
  }
}

const getUrlFor = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
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
  (state: GlobalState) => state.customLocation,
  (customLocation) => ({ customLocation }),
);

export default loadData({
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
} as LoadDataParameters)(TaxonomyFilter);
