// @flow
/* eslint no-magic-numbers: [1, {ignore: [0, 1, 2]}] */
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Link from 'components/generic/Link';

import EntriesOnProtein from './EntriesOnProtein';
import EntriesOnStructure from './EntriesOnStructure';
import StructureOnProtein from './StructureOnProtein';

import Table, { Column, PageSizeSelector, SearchBox } from 'components/Table';

import { foundationPartial } from 'styles/foundation';

import localStyle from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(fonts, localStyle);

const propTypes = {
  matches: T.arrayOf(T.object).isRequired,
  primary: T.string.isRequired,
  secondary: T.string.isRequired,
  isStale: T.bool,
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
  {
    matches,
    primary,
    secondary,
    ...props
  } /*: {
  matches: Array<Object>,
  primary: string,
  secondary: string,
  props: Array<any>,
} */,
) => {
  const MatchComponent = componentMatch[primary][secondary];
  return <MatchComponent matches={matches} {...props} />;
};
MatchesByPrimary.propTypes = propTypes;

// List of all matches, many to many
const Matches = (
  {
    matches,
    primary,
    secondary,
    actualSize,
    isStale,
    search,
    ...props
  } /*: {
   matches: Array<Object>,
   primary: string,
   secondary: string,
   actualSize: number,
   isStale: boolean,
   search: Object,
   props: Array<any>
} */,
) => {
  const pathname = '';
  return (
    <Table
      dataTable={matches.map(e => ({ match: e, ...e[primary] }))}
      actualSize={actualSize}
      query={search}
      pathname={pathname}
      isStale={isStale}
    >
      <PageSizeSelector />
      <SearchBox search={search.search} pathname={pathname}>
        Search
      </SearchBox>
      <Column
        dataKey="accession"
        renderer={(
          acc /*: string */,
          { source_database: sourceDatabase } /*: {source_database: string} */,
        ) => (
          <Link
            newTo={{
              description: {
                mainType: primary,
                mainDB: sourceDatabase,
                mainAccession: acc,
              },
            }}
          >
            {primary === 'protein' ? (
              <span className={f('acc-row')}>{acc}</span>
            ) : (
              <span>{acc}</span>
            )}
          </Link>
        )}
      >
        Accession
      </Column>
      <Column
        dataKey="name"
        renderer={(
          name /*: string */,
          {
            accession,
            source_database: sourceDatabase,
          } /*: {accession: string, source_database: string} */,
        ) => (
          <Link
            newTo={{
              description: {
                mainType: primary,
                mainDB: sourceDatabase,
                mainAccession: accession,
              },
            }}
          >
            {name}
          </Link>
        )}
      />
      {primary === 'protein' ? (
        <Column
          dataKey="source_database"
          className={f('table-center')}
          renderer={(db /*: string */) => (
            <span
              title={
                db === 'reviewed'
                  ? `${db} by curators (Swiss-Prot)`
                  : 'Not reviewed (TrEMBL)'
              }
            >
              <span className={f('icon', 'icon-functional')} data-icon={'/'} />
            </span>
          )}
        >
          Reviewed
        </Column>
      ) : (
        <Column
          dataKey="source_database"
          className={f('table-center')}
          renderer={(db /*: string */) => <span>pdb</span>}
        >
          Source database
        </Column>
      )}

      <Column dataKey="source_organism.fullname">Species</Column>

      {secondary === 'organism' ? null : (
        <Column
          dataKey="match"
          renderer={(match /*: Object */) => (
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
      )}
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

const mapStateToProps = createSelector(
  state => state.newLocation.search,
  search => ({ search }),
);

export default connect(mapStateToProps)(Matches);
