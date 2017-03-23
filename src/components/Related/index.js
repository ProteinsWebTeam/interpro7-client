
import React, {PropTypes as T} from 'react';
import Link from 'components/generic/Link';
import loadData, {searchParamsToURL} from 'higherOrder/loadData';

import Matches from 'components/Matches';

import {buildLink} from 'utils/url';
import {toPlural} from 'utils/pages';

import blockStyles from 'styles/blocks.css';

const ObjectToList = ({obj, component: Component}) => (
  <ul>
    {
      Object.entries(obj)
        .filter(([_, v]) => (
          // value !== 0 or, if object, contains values
          v && (typeof v !== 'object' || Object.keys(v).length)
        ))
        .map(([k, value]) => (
          <li key={k}>
            {
              typeof value === 'object' ?
                <span>
                  {`${k}: `}
                  <ObjectToList obj={value} component={Component} />
                </span> :
                <Component value={value} k={k} />
            }
          </li>
        ))
    }
  </ul>
);
ObjectToList.propTypes = {
  obj: T.object.isRequired,
  component: T.func.isRequired,
};

const RelatedSimple = ({secondaryData, main, secondary, pathname}) => (
  <div>
    <p>This {main} is related to this:</p>
    <ObjectToList
      obj={secondaryData}
      component={({k: db, value}) => (
        <Link to={buildLink(pathname, secondary, db)}>{db}: {value}</Link>
      )}
    />
  </div>
);
RelatedSimple.propTypes = {
  secondaryData: T.object.isRequired,
  main: T.string.isRequired,
  secondary: T.string.isRequired,
  pathname: T.string.isRequired,
};

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

const RelatedAdvanced = (
  {mainData, secondaryData, isStale, main, secondary, actualSize}
  ) => (
    <div>
      <p>
        This {main} is related to
        {
          secondaryData.length > 1 ?
            ` these ${toPlural(secondary)}:` :
            ` this ${secondary}:`
        }
      </p>
      <Matches
        actualSize={actualSize}
        matches={
          secondaryData.reduce((prev, {coordinates, ...secondaryData}) => (
            [...prev, {[main]: mainData, [secondary]: secondaryData, coordinates}]
          ), [])
        }
        isStale={isStale}
        {...primariesAndSecondaries[main][secondary]}
      />
    </div>
  );
RelatedAdvanced.propTypes = {
  mainData: T.object.isRequired,
  secondaryData: T.arrayOf(T.object).isRequired,
  isStale: T.bool.isRequired,
  main: T.string.isRequired,
  secondary: T.string.isRequired,
  actualSize: T.number,
};
const getReversedURL = ({
    settings: {api: {protocol, hostname, port, root}},
    location: {pathname, search},
  }) => {
  const index = pathname.slice(2).search('protein|entry|structure') + 1;
  const newPath = pathname.slice(index) + pathname.slice(0, index);
  const s = search || {};
  return `${protocol}//${hostname}:${port}${root}${newPath}?${searchParamsToURL(s)}`;
};
const RelatedAdvancedQuery = loadData(getReversedURL)(
  ({data: {payload, loading}, secondaryData: _, ...props}) => {
    if (loading) return <div>Loading...</div>;
    const _secondaryData = payload.results.map(x => {
      const obj = x.metadata;
      const plural = toPlural(props.main);
      // Given the reverse of the URL, and that we are quering by an accession
      // we can assume is only one, hence [0]
      obj.entry_protein_coordinates = x[plural][0].entry_protein_coordinates;
      obj.protein_structure_coordinates = x[plural][0].protein_structure_coordinates;
      return obj;
    });
    return (
      <RelatedAdvanced
        secondaryData={_secondaryData}
        actualSize={payload.count}
        {...props}
      />
    );
  }
);

const Related = ({data, secondary, ...props}) => {
  const {
    loading,
    payload: {metadata: mainData, [toPlural(secondary)]: secondaryData},
  } = data;
  if (loading) return <div>Loading...</div>;
  const RelatedComponent = (
    Array.isArray(secondaryData) ? RelatedAdvancedQuery : RelatedSimple
  );
  return (
    <div className={blockStyles.card}>
      <RelatedComponent
        secondaryData={secondaryData}
        mainData={mainData}
        secondary={secondary}
        {...props}
      />
    </div>
  );
};
Related.propTypes = {
  data: T.object.isRequired,
  secondary: T.string.isRequired,
};

export default Related;
