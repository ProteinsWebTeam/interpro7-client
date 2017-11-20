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
import ProteinFile from 'subPages/Organism/ProteinFile';
import Table, { Column, PageSizeSelector, SearchBox } from 'components/Table';
import { HighlightedText } from 'components/SimpleCommonComponents';

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

const ProteinAccessionsRenderer = taxId => (
  <ProteinFile taxId={taxId} type="accession" />
);

const ProteinFastasRenderer = taxId => (
  <ProteinFile taxId={taxId} type="FASTA" />
);

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
      dataTable={matches.map(e => ({
        ...e[primary],
        accession: String(e[primary].accession),
        match: e,
      }))}
      actualSize={actualSize}
      query={search}
      pathname={pathname}
      isStale={isStale}
      notFound={matches.length === 0}
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
            <span className={f('acc-row')}>
              <HighlightedText text={acc} textToHighlight={search.search} />
            </span>
          </Link>
        )}
      >
        {primary === 'organism' ? 'Tax Id' : 'Accession'}
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
            <HighlightedText text={name} textToHighlight={search.search} />
          </Link>
        )}
      />
      <Column
        dataKey="source_organism.fullname"
        displayIf={primary === 'protein' || primary === 'structure'}
      >
        Species
      </Column>
      <Column
        dataKey="source_database"
        className={f('table-center')}
        displayIf={primary !== 'organism'}
        renderer={(db /*: string */) => (
          <div>
            {db === 'reviewed' ? (
              <div
                title={
                  db === 'reviewed'
                    ? `${db} by curators (Swiss-Prot)`
                    : 'Not reviewed by curators (TrEMBL)'
                }
              >
                <span className={f('icon', 'icon-functional')} data-icon="/" />
              </div>
            ) : (
              db
            )}
          </div>
        )}
      >
        {primary === 'protein' ? 'Reviewed' : 'Source database'}
      </Column>
      <Column
        dataKey="match"
        displayIf={
          primary !== 'organism' &&
          secondary !== 'organism' &&
          primary !== 'set' &&
          secondary !== 'set'
        }
        renderer={(match /*: Object */) => (
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
      <Column
        dataKey="counters.proteins.uniprot"
        defaultKey="protein-count"
        className={f('table-center')}
        displayIf={primary === 'organism'}
      >
        protein count
      </Column>
      <Column
        dataKey="accession"
        defaultKey="proteinFastas"
        className={f('table-center')}
        displayIf={primary === 'organism'}
        renderer={ProteinFastasRenderer}
      >
        FASTA
      </Column>
      <Column
        dataKey="accession"
        className={f('table-center')}
        defaultKey="proteinAccessions"
        displayIf={primary === 'organism'}
        renderer={ProteinAccessionsRenderer}
      >
        Protein accessions
      </Column>
    </Table>
  );
};
Matches.propTypes = propTypes;

const mapStateToProps = createSelector(
  state => state.newLocation.search,
  search => ({ search }),
);

export default connect(mapStateToProps)(Matches);
