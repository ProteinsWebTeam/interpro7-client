import React, { PureComponent, useState } from 'react';
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

const KeySpeciesArea = ({ focusType, showKeySpecies }) => {
  const [showTaxoInfo, setShowTaxoInfo] = useState(true);
  if (focusType !== 'taxonomy') return null;
  return (
    <>
      {showTaxoInfo && (
        <div className={f('callout', 'info', 'withicon')} data-closable>
          <button
            className={f('close-button')}
            aria-label="Close alert"
            type="button"
            data-close
            onClick={() => setShowTaxoInfo(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h5>
            The taxonomy information is available for both Key species and all
            organisms. The below tables are shown based on the preference in
            InterPro settings. If you wish to change it, please do in the{' '}
            <Link to={{ description: { other: ['settings'] } }}>Settings</Link>{' '}
            page
          </h5>
        </div>
      )}
      {showKeySpecies && <KeySpeciesTable />}
    </>
  );
};

KeySpeciesArea.propTypes = {
  focusType: T.string,
  showKeySpecies: T.boolean,
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
  },
  secondaryDataLoading: boolean,
  showKeySpecies: boolean,
  showAllSpecies: boolean,
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
    showKeySpecies: T.bool.isRequired,
    showAllSpecies: T.bool.isRequired,
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
      showKeySpecies,
      showAllSpecies,
    } = this.props;
    const databases =
      (dataBase &&
        !dataBase.loading &&
        dataBase.payload &&
        dataBase.payload.databases) ||
      {};
    return (
      <div className={f('row', 'column')}>
        <KeySpeciesArea focusType={focusType} showKeySpecies={showKeySpecies} />

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
            {(focusType === 'taxonomy' && showAllSpecies) ||
            focusType !== 'taxonomy' ? (
              <>
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

                {focusType === 'protein' && (
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
                      {
                        [mainType]: mainData,
                        [focusType]: secondaryData,
                        coordinates,
                      },
                    ],
                    [],
                  )}
                  isStale={isStale}
                  databases={databases}
                  {...primariesAndSecondaries[mainType][focusType]}
                />
              </>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToPropsAdvanced = createSelector(
  (state) => state.customLocation.description.main.key,
  (state) =>
    Object.entries(state.customLocation.description).find(
      ([_key, value]) => value.isFilter && value.order === 1,
    ),
  (state) =>
    Object.entries(state.customLocation.description).filter(
      ([_key, value]) => value.isFilter && value.order !== 1,
    ),
  (state) => state.settings.ui.showKeySpecies,
  (state) => state.settings.ui.showAllSpecies,
  (
    mainType,
    [focusType, { db: focusDB }],
    otherFilters,
    showKeySpecies,
    showAllSpecies,
  ) => ({
    mainType,
    focusType,
    focusDB,
    otherFilters,
    showKeySpecies,
    showAllSpecies,
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
  hasSecondary: boolean,
}; */
class Related extends PureComponent /*:: <RelatedProps> */ {
  static propTypes = {
    data: T.object.isRequired,
    focusType: T.string.isRequired,
    hasSecondary: T.bool,
    showAllSpecies: T.bool.isRequired,
  };

  render() {
    const {
      data,
      focusType,
      hasSecondary,
      showAllSpecies,
      ...props
    } = this.props;
    if (data.loading) return <Loading />;
    let RelatedComponent = RelatedSimple;
    if (hasSecondary) {
      RelatedComponent =
        focusType === 'taxonomy' && !showAllSpecies
          ? RelatedTaxonomy
          : RelatedAdvancedQuery;
    }
    return <RelatedComponent mainData={data.payload.metadata} {...props} />;
  }
}

const mapStateToPropsDefault = createSelector(
  (state) =>
    Object.entries(state.customLocation.description).find(
      ([_key, value]) => value.isFilter && value.order === 1,
    ) || [],
  (state) => state.settings.ui.showAllSpecies,
  ([focusType, filter], showAllSpecies) => ({
    focusType,
    hasSecondary: filter && !!filter.db,
    showAllSpecies,
  }),
);

export default connect(mapStateToPropsDefault)(Related);
