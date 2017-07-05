import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import Link from 'components/generic/Link';
import description2path from 'utils/processLocation/description2path';
import loadData from 'higherOrder/loadData';

import Matches from 'components/Matches';

import { toPlural } from 'utils/pages';

import blockStyles from 'styles/blocks.css';

import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';
import EntriesOnStructure from 'components/Related/EntriesOnStructure';
import StructureOnProtein from 'components/Related/StructureOnProtein';

const ObjectToList = ({ obj, component: Component }) =>
  <ul>
    {Object.entries(obj)
      .filter(
        ([_, v]) =>
          // value !== 0 or, if object, contains values
          v && (typeof v !== 'object' || Object.keys(v).length),
      )
      .map(([k, value]) =>
        <li key={k}>
          {typeof value === 'object'
            ? <span>
                {`${k}: `}
                <ObjectToList obj={value} component={Component} />
              </span>
            : <Component value={value} k={k} />}
        </li>,
      )}
  </ul>;
ObjectToList.propTypes = {
  obj: T.object.isRequired,
  component: T.func.isRequired,
};

const _RelatedSimple = ({ secondaryData, mainType, focusType }) =>
  <div>
    <p>
      This {mainType} is related to this:
    </p>
    <ObjectToList
      obj={secondaryData}
      component={({ k: db, value }) =>
        <Link
          newTo={location => ({
            ...location,
            description: {
              mainType: focusType,
              mainDB: db,
            },
          })}
        >
          {db}: {value}
        </Link>}
    />
  </div>;
_RelatedSimple.propTypes = {
  secondaryData: T.object.isRequired,
  mainType: T.string.isRequired,
  focusType: T.string.isRequired,
};
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
};
const _RelatedAdvanced = ({
  mainData,
  secondaryData,
  isStale,
  mainType,
  focusType,
  focusDB,
  actualSize,
}) =>
  <div>
    {mainType === 'protein' && focusType === 'structure'
      ? <StructureOnProtein structures={secondaryData} protein={mainData} />
      : null}
    {mainType === 'structure' && focusType === 'entry'
      ? <EntriesOnStructure entries={secondaryData} />
      : null}
    {mainType === 'protein' && focusType === 'entry' && focusDB === 'InterPro'
      ? <ProteinEntryHierarchy entries={secondaryData} />
      : null}
    <p>
      This {mainType} is related to
      {secondaryData.length > 1
        ? ` these ${toPlural(focusType)}:`
        : ` this ${focusType}:`}
    </p>
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
  </div>;
_RelatedAdvanced.propTypes = {
  mainData: T.object.isRequired,
  secondaryData: T.arrayOf(T.object).isRequired,
  isStale: T.bool.isRequired,
  mainType: T.string.isRequired,
  focusType: T.string.isRequired,
  focusDB: T.string.isRequired,
  actualSize: T.number,
};
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
    return `${protocol}//${hostname}:${port}${root}${description2path(
      newDesc,
    )}?${qsStringify(s)}`;
  },
);
const mapStateToPropsAdvancedQuery = createSelector(
  state => state.newLocation.description.mainType,
  mainType => ({ mainType }),
);
const RelatedAdvancedQuery = connect(mapStateToPropsAdvancedQuery)(
  loadData(
    getReversedUrl,
  )(({ data: { payload, loading }, secondaryData, ...props }) => {
    if (loading) return <div>Loading...</div>;
    const _secondaryData = payload.results.map(x => {
      const obj = x.metadata;
      const plural = toPlural(props.mainType);
      // Given the reverse of the URL, and that we are quering by an accession
      // we can assume is only one, hence [0]
      obj.entry_protein_coordinates = x[plural][0].entry_protein_coordinates;
      obj.protein_structure_coordinates =
        x[plural][0].protein_structure_coordinates;
      if (x[plural][0].chain) {
        obj.chain = x[plural][0].chain;
      }
      return obj;
    });
    return (
      <RelatedAdvanced
        secondaryData={_secondaryData}
        actualSize={payload.count}
        {...props}
      />
    );
  }),
);

const Related = ({ data, focusType, ...props }) => {
  if (data.loading) return <div>Loading...</div>;
  const {
    metadata: mainData,
    [toPlural(focusType)]: secondaryData,
  } = data.payload;
  const RelatedComponent = Array.isArray(secondaryData)
    ? RelatedAdvancedQuery
    : RelatedSimple;
  return (
    <div className={blockStyles.card}>
      <RelatedComponent
        secondaryData={secondaryData}
        mainData={mainData}
        {...props}
      />
    </div>
  );
};
Related.propTypes = {
  data: T.object.isRequired,
  focusType: T.string.isRequired,
};
const mapStateToPropsDefault = createSelector(
  state => state.newLocation.description.focusType,
  focusType => ({ focusType }),
);

export default connect(mapStateToPropsDefault)(Related);
