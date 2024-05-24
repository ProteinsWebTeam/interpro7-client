import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { omit } from 'lodash-es';

import loadData from 'higherOrder/loadData/ts';

import Loading from 'components/SimpleCommonComponents/Loading';

import { toPlural } from 'utils/pages/toPlural';

import RelatedSimple from './RelatedSimple';
import RelatedAdvanced from './RelatedAdvanced';
import { findIn } from 'utils/processDescription/filterFuncions';
import { getUrlForMeta, getReversedUrl } from 'higherOrder/loadData/defaults';

const mapStateToPropsAdvancedQuery = createSelector(
  (state: GlobalState) => state.customLocation.description.main.key,
  (mainType) => ({ mainType }),
);

interface TaxonomyProps extends LoadDataProps<RootAPIPayload, 'Base'> {
  mainData: Metadata;
  mainType?: string;
  actualSize?: number;
}

const RelatedTaxonomy = loadData<RootAPIPayload, 'Base'>({
  getUrl: getUrlForMeta,
  propNamespace: 'Base',
  mapStateToProps: mapStateToPropsAdvancedQuery,
} as LoadDataParameters)(({
  dataBase,
  actualSize,
  ...props
}: TaxonomyProps) => {
  return dataBase ? (
    <RelatedAdvanced
      dataBase={dataBase}
      secondaryDataLoading={false}
      secondaryData={[]}
      isStale={false}
      actualSize={actualSize || 0}
      {...props}
    />
  ) : null;
});

interface AdvancedQProps
  extends LoadDataProps<
      PayloadList<EndpointWithMatchesPayload<Metadata, AnyMatch>>
    >,
    LoadDataProps<RootAPIPayload, 'Base'> {
  mainType?: Endpoint;
  mainData: Metadata;
}

const _RelatedAdvancedQuery = ({
  data,
  mainType,
  mainData,
  isStale,
  dataBase,
  ...props
}: AdvancedQProps) => {
  const { payload, loading, url, status } = data || {};
  const _secondaryData =
    payload && payload.results
      ? payload.results.map((x) => {
          const obj: Record<string, unknown> = { ...x.metadata };
          const plural: string = toPlural(mainType || '');
          obj.counters = omit(x, ['metadata', plural]);

          obj.matches = x[plural].map((match) => ({
            protein: match.protein,
            protein_length: match.protein_length,
            sequence: match.sequence,
            sequence_length: match.sequence_length,
            entry_protein_locations: match.entry_protein_locations,
            entry_structure_locations: match.entry_structure_locations,
            structure_protein_locations: match.structure_protein_locations,
            chain: match.chain,
          }));
          return obj as unknown as MetadataWithLocations;
        })
      : [];
  const c = payload ? payload.count : 0;
  return dataBase ? (
    <RelatedAdvanced
      mainData={mainData}
      isStale={!!isStale}
      secondaryDataLoading={!!loading}
      secondaryData={_secondaryData}
      actualSize={c}
      dataBase={dataBase}
      nextAPICall={payload?.next}
      previousAPICall={payload?.previous}
      currentAPICall={url}
      status={status}
      {...props}
    />
  ) : null;
};
const RelatedAdvancedQuery = loadData<RootAPIPayload, 'Base'>({
  getUrl: getUrlForMeta,
  propNamespace: 'Base',
})(
  loadData<PayloadList<EndpointWithMatchesPayload<Metadata, AnyMatch>>>({
    getUrl: getReversedUrl,
    mapStateToProps: mapStateToPropsAdvancedQuery,
  } as LoadDataParameters)(_RelatedAdvancedQuery),
);

type Props = {
  data: RequestedData<{ metadata: Metadata }>;
  focusType?: string;
  hash?: string;
  hasSecondary: boolean;
};
const Related = ({ data, focusType, hasSecondary, hash, ...props }: Props) => {
  if (data.loading) return <Loading />;
  if (!data?.payload?.metadata) return null;
  if (hasSecondary) {
    if (focusType === 'taxonomy' && hash !== 'table')
      return <RelatedTaxonomy mainData={data.payload.metadata} {...props} />;
    else
      return (
        <RelatedAdvancedQuery mainData={data.payload.metadata} {...props} />
      );
  }

  return <RelatedSimple mainData={data.payload.metadata} {...props} />;
};

const mapStateToPropsDefault = createSelector(
  (state: GlobalState) =>
    findIn(
      state.customLocation.description,
      (value: EndpointPartialLocation) => !!value.isFilter && value.order === 1,
    ),
  (state: GlobalState) => state.customLocation.hash,
  ([focusType, filter], hash) => ({
    focusType,
    hasSecondary: !!(
      filter &&
      (!!(filter as EndpointLocation).db ||
        !!(filter as EndpointLocation & { integration: string | null })
          .integration)
    ),
    hash,
  }),
);

export default connect(mapStateToPropsDefault)(Related);
