// @flow
/* eslint no-magic-numbers: [1, {ignore: [0, 1, 2]}] */
import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';
import Link from 'components/generic/Link';

import EntriesOnProtein from './EntriesOnProtein';
import EntriesOnStructure from './EntriesOnStructure';
import StructureOnProtein from './StructureOnProtein';


import Table, {Column, PageSizeSelector, SearchBox} from 'components/Table';

const propTypes = {
  matches: T.arrayOf(T.object).isRequired,
  primary: T.string.isRequired,
  secondary: T.string.isRequired,
  isStale: T.bool.isRequired,
  options: T.shape({
    baseSize: T.number,
    offset: T.number,
    niceRatio: T.number,
  }),
  actualSize: T.number,
  search: T.object,
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
  return (
    <MatchComponent matches={matches} {...props} />
  );
};
MatchesByPrimary.propTypes = propTypes;

// List of all matches, many to many
const Matches = (
  {matches, primary, secondary, actualSize, isStale, search, ...props}
  /*: {
        matches: Array<Object>,
        primary: string,
        secondary: string,
        actualSize: number,
        isStale: boolean,
        search: Object,
        props: Array<any>
      }
  */
) => {
  const pathname = '';
  return (
    <Table
      dataTable={matches.map(e => ({match: e, ...e[primary]}))}
      actualSize={actualSize}
      query={search}
      pathname={pathname}
      isStale={isStale}
    >
      <PageSizeSelector />
      <SearchBox
        search={search.search}
        pathname={pathname}
      >
        Search
      </SearchBox>
      <Column
        accessKey="accession"
        renderer={(
          acc/*: string */,
          {source_database: sourceDatabase}/*: {source_database: string} */
        ) => (
          <Link to={`/${primary}/${sourceDatabase}/${acc}`}>
            {acc}
          </Link>
        )}
      >
        Accession
      </Column>
      <Column
        accessKey="name"
        renderer={(
          name/*: string */,
          {accession, source_database: sourceDatabase}
          /*: {accession: string, source_database: string} */
        ) => (
          <Link to={`/${primary}/${sourceDatabase}/${accession}`}>
            {name}
          </Link>
        )}
      >
        Name
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
          location={location}
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

export default connect(({location: {search}}) => ({search}))(Matches);
