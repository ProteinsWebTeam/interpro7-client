// @flow
/* eslint no-magic-numbers: [1, {ignore: [0, 1, 2]}] */
import React, {PropTypes as T} from 'react';
import Link from 'components/generic/Link';

import EntriesOnProtein from './EntriesOnProtein';
import EntriesOnStructure from './EntriesOnStructure';
import StructureOnProtein from './StructureOnProtein';


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
    structure: StructureOnProtein,
  },
  entry: {
    protein: EntriesOnProtein,
    structure: EntriesOnStructure,
  },
  structure: {
    entry: EntriesOnStructure,
    protein: StructureOnProtein,
  },
};

// List of all matches for one `primary`, one to many
const MatchesByPrimary = (
  {matches, primary, secondary, ...props}
  /*: {matches: Array<Object>, primary: string, secondary: string, props: Array<any>}*/
) => {
  const MatchComponent = componentMatch[primary][secondary];
  matches.map((m) => {
    const n = m;
    if (m.coordinates.constructor === String) {
      n.coordinates = JSON.parse(m.coordinates);
    }
    return n;
  });
  return (
    <MatchComponent matches={matches} {...props} />
  );
};
MatchesByPrimary.propTypes = propTypes;

// List of all matches, many to many
const Matches = (
  {matches, primary, secondary, ...props}
  /*: {matches: Array<Object>, primary: string, secondary: string, props: Array<any>}*/
) => {
  const dataTable = {
    results: matches.map(e => ({match: e, ...e[primary]})),
    count: matches.length,
  };
  const pathname = '';
  const query = {};
  return (
    <Table
      data={dataTable}
      query={query}
      pathname={pathname}
    >
      <Column
        accessKey="accession"
        renderer={(acc/*: string */, row) => (
          <Link to={`/${primary}/${row.source_database}/${acc}`}>
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
        renderer={(match/*: Object */) => (
        <MatchesByPrimary
          matches={[match]}
          primary={primary}
          secondary={secondary}
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
