/* @flow */
/* eslint no-magic-numbers: [1, {ignore: [0, 1, 2]}] */
import React, {PropTypes as T} from 'react';
import {Link} from 'react-router/es6';

import EntriesOnProtein from './EntriesOnProtein';
import EntriesOnStructure from './EntriesOnStructure';
import ProteinsOnStructure from './ProteinsOnStructure';

import style from './style.css';

const propTypes = {
  matches: T.arrayOf(T.object).isRequired,
  primary: T.string.isRequired,
  secondary: T.string.isRequired,
  options: T.shape({
    baseSize: T.number,
    offset: T.number,
    niceRatio: T.number,
  }),
};

const componentMatch = {
  protein: {
    entry: EntriesOnProtein,
  },
  structure: {
    entry: EntriesOnStructure,
    protein: ProteinsOnStructure,
  },
};

// List of all matches for one `primary`, one to many
const MatchesByPrimary = (
  {matches, primary, secondary, ...props}
) => {
  const MatchComponent = componentMatch[primary][secondary];
  return (
    <li>
      <Link to="" />
      <MatchComponent matches={matches} {...props} />
    </li>
  );
};
MatchesByPrimary.propTypes = propTypes;

// List of all matches, many to many
const Matches = (
  {matches, primary, ...props}
  /*: {matches: Array<Object>, primary: string, props: Array<any>}*/
) => {
  const matchesByPrimary = matches.reduce((prev, match) => {
    const acc = match[primary].accession;
    if (prev[acc]) {
      prev[acc].push(match);
      return prev;
    }
    return Object.assign(prev, {[acc]: [match]});
  }, {});
  return (
    <ul className={style.list}>
      {Object.entries(matchesByPrimary).map(([acc, matches]) => (
        <MatchesByPrimary
          key={acc}
          matches={matches}
          primary={primary}
          {...props}
        />
      ))}
    </ul>
  );
};
Matches.propTypes = propTypes;

export default Matches;
