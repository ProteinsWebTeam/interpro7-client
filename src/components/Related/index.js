import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';
import omit from 'lodash-es/omit';

import Link from 'components/generic/Link';
import description2path from 'utils/processLocation/description2path';
import loadData from 'higherOrder/loadData';

import Matches from 'components/Matches';
import Loading from 'components/SimpleCommonComponents/Loading';

import { toPlural } from 'utils/pages';

import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';
import EntriesOnStructure from 'components/Related/DomainEntriesOnStructure';
import StructureOnProtein from 'components/Related/DomainStructureOnProtein';

import { foundationPartial } from 'styles/foundation';

import global from 'styles/global.css';
const f = foundationPartial(global);

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
              to={location => ({
                ...location,
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
  state => state.newLocation.description.mainType,
  state => state.newLocation.description.focusType,
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
    organism: {
      primary: 'organism',
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
  organism: {
    entry: {
      primary: 'entry',
      secondary: 'organism',
    },
    protein: {
      primary: 'protein',
      secondary: 'organism',
    },
    structure: {
      primary: 'structure',
      secondary: 'organism',
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
    organism: {
      primary: 'organism',
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
    focusDB: T.string,
    actualSize: T.number,
  };

  render() {
    const {
      mainData,
      secondaryData,
      isStale,
      mainType,
      focusType,
      focusDB,
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
        {mainType === 'protein' &&
        focusType === 'entry' &&
        focusDB === 'InterPro' ? (
          <ProteinEntryHierarchy entries={secondaryData} />
        ) : null}
        <div className={f('row')}>
          <div className={f('columns')}>
            {mainType === 'protein' && focusType === 'entry' ? (
              <p>
                This {mainType} contains
                {secondaryData.length > 1
                  ? ` these ${toPlural(focusType)}:`
                  : ` this ${focusType}:`}
              </p>
            ) : (
              <p>
                This {mainType} is related to
                {secondaryData.length > 1
                  ? ` these ${toPlural(focusType)}:`
                  : ` this ${focusType}:`}
              </p>
            )}
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
  state => state.newLocation.description.mainType,
  state => state.newLocation.description.focusType,
  state => state.newLocation.description.focusDB,
  (mainType, focusType, focusDB) => ({ mainType, focusType, focusDB }),
);
const RelatedAdvanced = connect(mapStateToPropsAdvanced)(_RelatedAdvanced);

const getReversedUrl = createSelector(
  state => state.settings.api,
  state => state.newLocation.description,
  state => state.newLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    const newDesc = Object.entries(description).reduce((acc, [key, value]) => {
      let newKey = key;
      if (key.startsWith('focus')) newKey = newKey.replace('focus', 'main');
      if (key.startsWith('main')) newKey = newKey.replace('main', 'focus');
      // eslint-disable-next-line no-param-reassign
      acc[newKey] = value;
      return acc;
    }, {});
    const s = search || {};
    let url = `${protocol}//${hostname}:${port}${root}${description2path(
      newDesc,
    )}?${qsStringify(s)}`;
    if (
      description.mainType === 'entry' &&
      description.focusType === 'organism'
    ) {
      url = url.replace('/entry/', '/protein/entry/');
    }
    return url;
  },
);
const mapStateToPropsAdvancedQuery = createSelector(
  state => state.newLocation.description.mainType,
  mainType => ({ mainType }),
);
const RelatedAdvancedQuery = connect(mapStateToPropsAdvancedQuery)(
  loadData(getReversedUrl)(
    ({ data: { payload, loading }, secondaryData, ...props }) => {
      if (loading) return <Loading />;
      const _secondaryData =
        payload && payload.results
          ? payload.results.map(x => {
              const { ...obj } = x.metadata;
              const plural = toPlural(props.mainType);
              obj.counters = omit(x, ['metadata', plural]);
              // Given the reverse of the URL, and that we are querying by an accession
              // we can assume is only one, hence [0]
              obj.entry_protein_locations =
                x[plural][0].entry_protein_locations;
              obj.protein_length = x[plural][0].protein_length;
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
        <RelatedAdvanced
          secondaryData={_secondaryData}
          actualSize={c}
          {...props}
        />
      );
    },
  ),
);

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
  state => state.newLocation.description.focusType,
  focusType => ({ focusType }),
);

export default connect(mapStateToPropsDefault)(Related);
