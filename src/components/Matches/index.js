/* @flow */
/* eslint no-magic-numbers: [1, {ignore: [0, 1, 2]}] */
import React, {PropTypes as T} from 'react';
import {Link} from 'react-router/es';

import EntriesOnProtein from './EntriesOnProtein';
import EntriesOnStructure from './EntriesOnStructure';
import ProteinsOnStructure from './ProteinsOnStructure';

import Table, {Column} from 'components/Table';

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
    <MatchComponent matches={matches} {...props} />
  );
};
MatchesByPrimary.propTypes = propTypes;

// List of all matches, many to many
const Matches = (
  {matches, primary, ...props}
  /*: {matches: Array<Object>, primary: string, props: Array<any>}*/
) => {
  const dataTable = {
    results: matches.map(e => ({match: e, ...e.protein})),
    count: matches.length,
  };
  const pathname = '',
    query = {};
  return (
    <Table
      data={dataTable}
      query={query}
      pathname={pathname}
    >
      <Column
        accessKey="accession"
        renderer={(acc/*: string */, row) => (
          <Link to={`${primary}/${row.source_database}/${acc}`}>
            {acc}
          </Link>
        )}
      >
        Accession
      </Column>
      <Column accessKey="source_database">
        Source Database
      </Column>
      <Column
        accessKey="match"
        renderer={(match/*: string */) => (
        <MatchesByPrimary
          matches={[match]}
          primary={primary}
          {...props}
        />
        )}
      >
        Architecture
      </Column>

    </Table>
      // {Object.entries(matchesByPrimary).map(([acc, matches]) => (
      //   <MatchesByPrimary
      //     key={acc}
      //     matches={matches}
      //     primary={primary}
      //     {...props}
      //   />
      // ))}
  );
};
Matches.propTypes = propTypes;

export default Matches;
