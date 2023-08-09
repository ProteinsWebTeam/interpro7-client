// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { omit } from 'lodash-es';

import loadData from 'higherOrder/loadData';

import Loading from 'components/SimpleCommonComponents/Loading';

import { toPlural } from 'utils/pages';

// $FlowFixMe
import RelatedSimple from './RelatedSimple';
// $FlowFixMe
import RelatedAdvanced from './RelatedAdvanced';
// $FlowFixMe
import { findIn } from 'utils/processDescription/filterFuncions';
import { getUrlForMeta, getReversedUrl } from 'higherOrder/loadData/defaults';

const mapStateToPropsAdvancedQuery = createSelector(
  (state) => state.customLocation.description.main.key,
  (mainType) => ({ mainType }),
);

const RelatedTaxonomy = loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'Base',
})(({ ...props }) => {
  return (
    <RelatedAdvanced
      secondaryDataLoading={false}
      secondaryData={[]}
      isStale={false}
      {...props}
    />
  );
});

const RelatedAdvancedQuery = loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'Base',
})(
  loadData({
    getUrl: getReversedUrl,
    mapStateToProps: mapStateToPropsAdvancedQuery,
  })(({ data, ...props }) => {
    const { payload, loading, url, status } = data;
    const _secondaryData =
      payload && payload.results
        ? payload.results.map((x) => {
            const { ...obj } = x.metadata;
            const plural = toPlural(props.mainType);
            obj.counters = omit(x, ['metadata', plural]);
            // Given the reverse of the URL, and that we are querying by an accession
            // we can assume is only one, hence [0]

            // 👆👆NOT true for multiple chains
            obj.protein = x[plural][0].protein;
            obj.protein_length = x[plural][0].protein_length;
            obj.sequence = x[plural][0].sequence;
            obj.sequence_length = x[plural][0].sequence_length;
            obj.entry_protein_locations = x[plural][0].entry_protein_locations;
            obj.entry_structure_locations =
              x[plural][0].entry_structure_locations;
            obj.structure_protein_locations =
              x[plural][0].structure_protein_locations;
            if (x[plural][0].chain) {
              obj.chain = x[plural][0].chain;
            }
            return obj;
          })
        : [];
    const c = payload ? payload.count : 0;
    return (
      <RelatedAdvanced
        secondaryDataLoading={loading}
        secondaryData={_secondaryData}
        actualSize={c}
        nextAPICall={payload?.next}
        previousAPICall={payload?.previous}
        currentAPICall={url}
        status={status}
        {...props}
      />
    );
  }),
);

/*:: type RelatedProps = {
  data: Object,
  focusType: string,
  hash?: string,
  hasSecondary: boolean,
}; */
class Related extends PureComponent /*:: <RelatedProps> */ {
  static propTypes = {
    data: T.object.isRequired,
    focusType: T.string.isRequired,
    hasSecondary: T.bool,
    hash: T.string,
  };

  render() {
    const { data, focusType, hasSecondary, hash, ...props } = this.props;
    if (data.loading) return <Loading />;
    let RelatedComponent = RelatedSimple;
    if (hasSecondary) {
      RelatedComponent =
        focusType === 'taxonomy' && hash !== 'table'
          ? RelatedTaxonomy
          : RelatedAdvancedQuery;
    }
    // $FlowFixMe
    return <RelatedComponent mainData={data.payload.metadata} {...props} />;
  }
}
const mapStateToPropsDefault = createSelector(
  (state) =>
    findIn(
      state.customLocation.description,
      (value /*: {isFilter:boolean, order:number} */) =>
        value.isFilter && value.order === 1,
    ),
  (state) => state.customLocation.hash,
  ([focusType, filter], hash) => ({
    focusType,
    hasSecondary: filter && (!!filter.db || !!filter.integration),
    hash,
  }),
);

export default connect(mapStateToPropsDefault)(Related);
