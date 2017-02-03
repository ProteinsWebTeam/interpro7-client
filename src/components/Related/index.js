
import React, {PropTypes as T} from 'react';
import Link from 'components/Link';

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
      primary: 'structure',
      secondary: 'entry',
    },
    protein: {
      primary: 'structure',
      secondary: 'protein',
    },
  },
};

const RelatedAdvanced = ({mainData, secondaryData, main, secondary}) => (
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
      matches={
        secondaryData.reduce((prev, {coordinates, ...secondaryData}) => (
          [...prev, {[main]: mainData, [secondary]: secondaryData, coordinates}]
        ), [])
      }
      {...primariesAndSecondaries[main][secondary]}
    />
  </div>
);
RelatedAdvanced.propTypes = {
  mainData: T.object.isRequired,
  secondaryData: T.arrayOf(T.object).isRequired,
  main: T.string.isRequired,
  secondary: T.string.isRequired,
};

const Related = ({data, secondary, ...props}) => {
  const {metadata: mainData, [toPlural(secondary)]: secondaryData} = data;
  const RelatedComponent = (
    Array.isArray(secondaryData) ? RelatedAdvanced : RelatedSimple
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
