import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';
import { omit } from 'lodash-es';

import Link from 'components/generic/Link';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData';

import Matches from 'components/Matches';
import Loading from 'components/SimpleCommonComponents/Loading';

import { toPlural } from 'utils/pages';

import EntriesOnStructure from 'components/Related/DomainEntriesOnStructure';
import StructureOnProtein from 'components/Related/DomainStructureOnProtein';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles);

class ObjectToList extends PureComponent {
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

class _RelatedSimple extends PureComponent {
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

export class _RelatedAdvanced extends PureComponent {
  static propTypes = {
    mainData: T.object.isRequired,
    secondaryData: T.arrayOf(T.object).isRequired,
    isStale: T.bool.isRequired,
    mainType: T.string.isRequired,
    focusType: T.string.isRequired,
    actualSize: T.number,
  };

  render() {
    const {
      mainData,
      secondaryData,
      isStale,
      mainType,
      focusType,
      actualSize,
    } = this.props;
    return (
      <div>
        {mainType === 'protein' && focusType === 'structure' ? (
          <StructureOnProtein structures={secondaryData} protein={mainData} />
        ) : null}
        {mainType === 'structure' && focusType === 'entry' ? (
          <EntriesOnStructure entries={secondaryData} />
        ) : null}
        <div className={f('row')}>
          <div className={f('columns')}>
            <p>
              This {mainType} matches
              {secondaryData.length > 1
                ? ` these ${toPlural(focusType)}:`
                : ` this ${focusType}:`}
            </p>
          </div>
        </div>
        <Matches
          actualSize={actualSize}
          matches={secondaryData.reduce(
            (prev, { coordinates, ...secondaryData }) => [
              ...prev,
              { [mainType]: mainData, [focusType]: secondaryData, coordinates },
            ],
            [],
          )}
          isStale={isStale}
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
      ([_key, value]) => value.isFilter,
    ),
  (mainType, [focusType, { db: focusDB }]) => ({
    mainType,
    focusType,
    focusDB,
  }),
);
const RelatedAdvanced = connect(mapStateToPropsAdvanced)(_RelatedAdvanced);

const getReversedUrl = createSelector(
  state => state.settings.api,
  state => state.settings.navigation.pageSize,
  state => state.customLocation.description,
  state => state.customLocation.search,
  (
    { protocol, hostname, port, root },
    settingsPageSize,
    description,
    search,
  ) => {
    // copy of description, to modify it after
    const newDesc = {};
    let newMain;
    for (const [key, value] of Object.entries(description)) {
      newDesc[key] = { ...value };
      if (value.isFilter) {
        newMain = key;
        newDesc[key].isFilter = false;
      }
    }
    newDesc[description.main.key].isFilter = true;
    newDesc.main.key = newMain;
    let url = format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(newDesc),
      query: {
        ...search,
        extra_fields: 'counters',
        page_size: search.page_size || settingsPageSize,
      },
    });
    if (description.main.key === 'entry' && newMain === 'taxonomy') {
      url = url.replace('/entry/', '/protein/entry/');
    }
    if (description.main.key === 'taxonomy' && newMain === 'proteome') {
      url = url.replace('/taxonomy/', '/protein/taxonomy/');
    }
    return url;
  },
);
const mapStateToPropsAdvancedQuery = createSelector(
  state => state.customLocation.description.main.key,
  mainType => ({ mainType }),
);
const RelatedAdvancedQuery = loadData({
  getUrl: getReversedUrl,
  mapStateToProps: mapStateToPropsAdvancedQuery,
})(({ data: { payload, loading }, secondaryData, ...props }) => {
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
          obj.protein_structure_locations =
            x[plural][0].protein_structure_locations;
          if (x[plural][0].chain) {
            obj.chain = x[plural][0].chain;
          }
          return obj;
        })
      : [];
  const c = payload ? payload.count : 0;
  return (
    <RelatedAdvanced secondaryData={_secondaryData} actualSize={c} {...props} />
  );
});

class Related extends PureComponent {
  static propTypes = {
    data: T.object.isRequired,
    focusType: T.string.isRequired,
  };

  render() {
    const { data, focusType, ...props } = this.props;
    if (data.loading) return <Loading />;
    const {
      metadata: mainData,
      [toPlural(focusType)]: secondaryData,
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
      ([_key, value]) => value.isFilter,
    ) || [])[0],
  focusType => ({ focusType }),
);

export default connect(mapStateToPropsDefault)(Related);
