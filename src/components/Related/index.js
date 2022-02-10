// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { omit } from 'lodash-es';

import Link from 'components/generic/Link';
import loadData from 'higherOrder/loadData';

import Loading from 'components/SimpleCommonComponents/Loading';

import { toPlural } from 'utils/pages';

import RelatedTable from 'components/Related/RelatedTable';
import EntriesOnStructure from 'components/Related/DomainEntriesOnStructure';
import StructureOnProtein from 'components/Related/DomainStructureOnProtein';
import { getUrlForMeta, getReversedUrl } from 'higherOrder/loadData/defaults';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles);

const findIn = (
  description /*: {} */,
  fn /*: ({isFilter:boolean, order:number})=> boolean*/,
) =>
  // prettier-ignore
  (Object.entries(description) /*: any */)
    .find(([_key, value]) => fn(value)) || [];

const filterIn = (
  description /*: {} */,
  fn /*: ({isFilter:boolean, order:number})=> boolean*/,
) =>
  // prettier-ignore
  (Object.entries(description) /*: any */)
    .filter(([_key, value]) => fn(value)) || [];

/*:: type ObjectToListProps = {
  obj: Object,
  component: function,
}; */

class ObjectToList extends PureComponent /*:: <ObjectToListProps> */ {
  static propTypes = {
    obj: T.object.isRequired,
    component: T.func.isRequired,
  };

  render() {
    const { obj, component: Component } = this.props;
    return (
      <ul>
        {Object.entries(obj)
          .filter(
            ([_, v]) =>
              // value !== 0 or, if object, contains values
              v && (typeof v !== 'object' || Object.keys(v).length),
          )
          .map(([k, value]) => (
            <li key={k}>
              {typeof value === 'object' ? (
                <span>
                  {`${k}: `}
                  <ObjectToList obj={value} component={Component} />
                </span>
              ) : (
                <Component value={value} k={k} />
              )}
            </li>
          ))}
      </ul>
    );
  }
}

/*:: type RelatedSimpleProps = {
  secondaryData: Object,
  mainType: string,
  focusType: string,
}; */
class _RelatedSimple extends PureComponent /*:: <RelatedSimpleProps> */ {
  static propTypes = {
    secondaryData: T.object.isRequired,
    mainType: T.string.isRequired,
    focusType: T.string.isRequired,
  };

  render() {
    const { secondaryData, mainType, focusType } = this.props;
    return (
      <div className={f('row')}>
        <p>This {mainType} is related to this:</p>
        <ObjectToList
          obj={secondaryData}
          component={({ k: db, value }) => (
            <Link
              to={(customLocation) => ({
                ...customLocation,
                description: {
                  main: { key: focusType },
                  [focusType]: { db },
                },
              })}
            >
              {db}: {value}
            </Link>
          )}
        />
      </div>
    );
  }
}

const mapStateToPropsSimple = createSelector(
  (state) => state.customLocation.description.main.key,
  (state) =>
    findIn(
      state.customLocation.description,
      (value /*: {isFilter:boolean, order:number} */) => value.isFilter,
    ),
  (mainType, focusType) => ({ mainType, focusType }),
);
const RelatedSimple = connect(mapStateToPropsSimple)(_RelatedSimple);

/*:: type relatedAdvancedProps = {
  mainData: Object,
  secondaryData: Array<Object>,
  isStale: boolean,
  mainType: string,
  focusType: string,
  actualSize: number,
  otherFilters?: Array<Object>,
  dataBase: {
    payload: Object,
    loading: boolean
  },
  secondaryDataLoading: boolean,
}; */
/*:: type state = {
  showTaxoInfo: boolean,
}; */
export class _RelatedAdvanced extends PureComponent /*:: <relatedAdvancedProps> */ {
  static propTypes = {
    mainData: T.object.isRequired,
    secondaryData: T.arrayOf(T.object).isRequired,
    isStale: T.bool.isRequired,
    mainType: T.string.isRequired,
    focusType: T.string.isRequired,
    actualSize: T.number,
    otherFilters: T.array,
    dataBase: T.shape({
      payload: T.object,
      loading: T.bool.isRequired,
    }).isRequired,
    secondaryDataLoading: T.bool.isRequired,
  };

  render() {
    const {
      mainData,
      secondaryData,
      isStale,
      mainType,
      focusType,
      actualSize,
      otherFilters,
      dataBase,
      secondaryDataLoading,
    } = this.props;
    return (
      <div className={f('row', 'column')}>
        {secondaryDataLoading ? (
          <Loading />
        ) : (
          <div>
            {mainType === 'protein' && focusType === 'structure' ? (
              <StructureOnProtein
                structures={secondaryData}
                protein={mainData}
              />
            ) : null}
            {mainType === 'structure' && focusType === 'entry' ? (
              <EntriesOnStructure entries={secondaryData} />
            ) : null}
            <RelatedTable
              mainType={mainType}
              mainData={mainData}
              secondaryData={secondaryData}
              focusType={focusType}
              otherFilters={otherFilters}
              dataBase={dataBase}
              isStale={isStale}
              actualSize={actualSize}
              otherProps={{ ...this.props }}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToPropsAdvanced = createSelector(
  (state) => state.customLocation.description.main.key,
  (state) =>
    findIn(
      state.customLocation.description,
      (value /*: {isFilter:boolean, order:number} */) =>
        value.isFilter && value.order === 1,
    ),
  (state) =>
    filterIn(
      state.customLocation.description,
      (value /*: {isFilter:boolean, order:number} */) =>
        value.isFilter && value.order !== 1,
    ),
  (mainType, [focusType, { db: focusDB }], otherFilters) => ({
    mainType,
    focusType,
    focusDB,
    otherFilters,
  }),
);
const RelatedAdvanced = connect(mapStateToPropsAdvanced)(_RelatedAdvanced);

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
            obj.entry_protein_locations = x[plural][0].entry_protein_locations;
            obj.protein_length = x[plural][0].protein_length;
            obj.protein = x[plural][0].protein;
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
    hash,
    hasSecondary: filter && (!!filter.db || !!filter.integration),
  }),
);

export default connect(mapStateToPropsDefault)(Related);
