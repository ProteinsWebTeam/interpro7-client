import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { omit } from 'lodash-es';

import Link from 'components/generic/Link';
import loadData from 'higherOrder/loadData';

import Matches from 'components/Matches';
import Loading from 'components/SimpleCommonComponents/Loading';

import { toPlural } from 'utils/pages';

import EntriesOnStructure from 'components/Related/DomainEntriesOnStructure';
import StructureOnProtein from 'components/Related/DomainStructureOnProtein';
import KeySpeciesTable from 'components/Taxonomy/KeySpeciesTable';

import FiltersPanel from 'components/FiltersPanel';
import CurationFilter from 'components/Protein/ProteinListFilters/CurationFilter';
import { getUrlForMeta, getReversedUrl } from 'higherOrder/loadData/defaults';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles);

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
              to={customLocation => ({
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
  state => state.customLocation.description.main.key,
  state =>
    (Object.entries(state.customLocation.description).find(
      ([_key, value]) => value.isFilter,
    ) || [])[0],
  (mainType, focusType) => ({ mainType, focusType }),
);
const RelatedSimple = connect(mapStateToPropsSimple)(_RelatedSimple);

const primariesAndSecondaries = {
  entry: {
    protein: {
      primary: 'protein',
      secondary: 'entry',
    },
    structure: {
      primary: 'structure',
      secondary: 'entry',
    },
    taxonomy: {
      primary: 'taxonomy',
      secondary: 'entry',
    },
    proteome: {
      primary: 'proteome',
      secondary: 'entry',
    },
    set: {
      primary: 'set',
      secondary: 'entry',
    },
  },
  protein: {
    entry: {
      primary: 'entry',
      secondary: 'protein',
    },
    structure: {
      primary: 'structure',
      secondary: 'protein',
    },
  },
  structure: {
    entry: {
      primary: 'entry',
      secondary: 'structure',
    },
    protein: {
      primary: 'protein',
      secondary: 'structure',
    },
  },
  taxonomy: {
    entry: {
      primary: 'entry',
      secondary: 'taxonomy',
    },
    protein: {
      primary: 'protein',
      secondary: 'taxonomy',
    },
    structure: {
      primary: 'structure',
      secondary: 'taxonomy',
    },
    proteome: {
      primary: 'proteome',
      secondary: 'taxonomy',
    },
  },
  proteome: {
    entry: {
      primary: 'entry',
      secondary: 'proteome',
    },
    protein: {
      primary: 'protein',
      secondary: 'proteome',
    },
    structure: {
      primary: 'structure',
      secondary: 'proteome',
    },
  },
  set: {
    entry: {
      primary: 'entry',
      secondary: 'set',
    },
    protein: {
      primary: 'protein',
      secondary: 'set',
    },
    structure: {
      primary: 'structure',
      secondary: 'set',
    },
    taxonomy: {
      primary: 'taxonomy',
      secondary: 'set',
    },
    proteome: {
      primary: 'proteome',
      secondary: 'set',
    },
  },
};
const InfoFilters = (
  {
    filters,
    focusType,
    databases,
  } /*: {filters: Array<Object>, focusType: string, databases: Object} */,
) => {
  if (!filters || filters.length === 0) return null;
  return (
    <div className={f('callout', 'info', 'withicon')}>
      This list shows only:
      <ul>
        {filters.map(([endpoint, { db, accession }]) => (
          <li key={endpoint}>
            {toPlural(focusType)} associated with{' '}
            <b>{accession ? endpoint : toPlural(endpoint)}</b>
            {accession && (
              <span>
                {' '}
                accession <b>{accession}</b>
              </span>
            )}
            {db && (
              <span>
                {' '}
                from the <b>
                  {(databases[db] && databases[db].name) || db}
                </b>{' '}
                database
              </span>
            )}
            .
          </li>
        ))}
      </ul>
    </div>
  );
};
InfoFilters.propTypes = {
  databases: T.object.isRequired,
  focusType: T.string.isRequired,
  filters: T.array,
};

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
  }
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
    } = this.props;
    const databases =
      (dataBase &&
        !dataBase.loading &&
        dataBase.payload &&
        dataBase.payload.databases) ||
      {};
    return (
      <div className={f('row', 'column')}>
        {mainType === 'protein' && focusType === 'structure' ? (
          <StructureOnProtein structures={secondaryData} protein={mainData} />
        ) : null}
        {mainType === 'structure' && focusType === 'entry' ? (
          <EntriesOnStructure entries={secondaryData} />
        ) : null}

        {focusType === 'taxonomy' ? <KeySpeciesTable /> : null}
        <p>
          This {mainType} matches
          {secondaryData.length > 1
            ? ` these ${toPlural(focusType)}:`
            : ` this ${focusType}:`}
        </p>
        <InfoFilters
          filters={otherFilters}
          focusType={focusType}
          databases={databases}
        />

        {focusType === 'protein' && secondaryData.length > 1 && (
          <FiltersPanel>
            <CurationFilter label="UniProt Curation" />
          </FiltersPanel>
        )}
        <Matches
          {...this.props}
          actualSize={actualSize}
          matches={secondaryData.reduce(
            (prev, { coordinates, ...secondaryData }) => [
              ...prev,
              { [mainType]: mainData, [focusType]: secondaryData, coordinates },
            ],
            [],
          )}
          isStale={isStale}
          databases={databases}
          {...primariesAndSecondaries[mainType][focusType]}
        />
      </div>
    );
  }
}

const mapStateToPropsAdvanced = createSelector(
  state => state.customLocation.description.main.key,
  state =>
    Object.entries(state.customLocation.description).find(
      ([_key, value]) => value.isFilter && value.order === 1,
    ),
  state =>
    Object.entries(state.customLocation.description).filter(
      ([_key, value]) => value.isFilter && value.order !== 1,
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
  state => state.customLocation.description.main.key,
  mainType => ({ mainType }),
);
const RelatedAdvancedQuery = loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'Base',
})(
  loadData({
    getUrl: getReversedUrl,
    mapStateToProps: mapStateToPropsAdvancedQuery,
  })(({ data, secondaryData, ...props }) => {
    const { payload, loading, url } = data;
    if (loading) return <Loading />;
    const _secondaryData =
      payload && payload.results
        ? payload.results.map(x => {
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
        secondaryData={_secondaryData}
        actualSize={c}
        nextAPICall={payload?.next}
        previousAPICall={payload?.previous}
        currentAPICall={url}
        {...props}
      />
    );
  }),
);

/*:: type RelatedProps = {
  data: Object,
  focusType: string,
}; */
class Related extends PureComponent /*:: <RelatedProps> */ {
  static propTypes = {
    data: T.object.isRequired,
    focusType: T.string.isRequired,
  };

  render() {
    const { data, focusType, ...props } = this.props;
    if (data.loading) return <Loading />;
    const {
      metadata: mainData,
      [`${focusType}_subset`]: secondaryData,
    } = data.payload;
    if (!secondaryData) return <Loading />;
    const RelatedComponent = Array.isArray(secondaryData)
      ? RelatedAdvancedQuery
      : RelatedSimple;
    return (
      <RelatedComponent
        secondaryData={secondaryData}
        mainData={mainData}
        {...props}
      />
    );
  }
}

const mapStateToPropsDefault = createSelector(
  state =>
    (Object.entries(state.customLocation.description).find(
      ([_key, value]) => value.isFilter && value.order === 1,
    ) || [])[0],
  focusType => ({ focusType }),
);

export default connect(mapStateToPropsDefault)(Related);
