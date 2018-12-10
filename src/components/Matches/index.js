/* eslint-disable react/display-name */
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';

import EntriesOnProtein from './EntriesOnProtein';
import EntriesOnStructure from './EntriesOnStructure';
import StructureOnProtein from './StructureOnProtein';
import File from 'components/File';
import Table, {
  Column,
  PageSizeSelector,
  SearchBox,
  Exporter,
} from 'components/Table';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import NumberComponent from 'components/NumberComponent';
import { PDBeLink } from 'components/ExtLink';
import Lazy from 'wrappers/Lazy';
import LazyImage from 'components/LazyImage';

import { getUrlForApi } from 'higherOrder/loadData/defaults';

import { searchSelector } from 'reducers/custom-location/search';
import { descriptionSelector } from 'reducers/custom-location/description';

import { foundationPartial } from 'styles/foundation';

import localStyle from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import loadable from 'higherOrder/loadable';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import config from 'config';

const f = foundationPartial(fonts, localStyle);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemamap = {
  entry: {
    protein: ['@isContainedIn', 'Protein'],
    taxonomy: ['@isContainedIn', 'Taxonomy'],
    proteome: ['@isContainedIn', 'Proteome'],
    structure: ['@isContainedIn', 'Structure'],
    set: ['@isContainedIn', 'Set'],
  },
  protein: {
    entry: ['@contains', 'Entry'],
    structure: ['@additionalProperty', 'Structure'],
  },
  structure: {
    entry: ['@additionalProperty', 'Entry'],
    protein: ['@isContainedIn', 'Protein'],
    taxonomy: ['@isContainedIn', 'Taxonomy'],
    proteome: ['@isContainedIn', 'Proteome'],
  },
  taxonomy: {
    entry: ['@contains', 'Entry'],
    protein: ['@contains', 'Protein'],
    structure: ['@contains', 'Structure'],
    proteome: ['@contains', 'Proteome'],
  },
  proteome: {
    entry: ['@contains', 'Entry'],
    protein: ['@contains', 'Protein'],
    structure: ['@contains', 'Structure'],
  },
  set: {
    entry: ['@additionalProperty', 'Entry'],
    protein: ['@additionalProperty', 'Protein'],
    structure: ['@additionalProperty', 'Structure'],
    taxonomy: ['@additionalProperty', 'Taxonomy'],
    proteome: ['@additionalProperty', 'Proteome'],
  },
};

const schemaProcessData = ({ data, primary, secondary }) => {
  const [id, type] = schemamap[secondary][primary];
  return {
    '@id': id,
    '@type': [type, 'StructuredValue', 'BioChemEntity', 'CreativeWork'],
    identifier: data.accession,
    name: data.name,
    url:
      config.root.website.protocol +
      config.root.website.href +
      descriptionToPath({
        main: { key: primary },
        [primary]: { db: data.source_database, accession: data.accession },
      }),
  };
};

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

export const ProteinDownloadRenderer = description => (accession, row) => (
  <File
    fileType="fasta"
    name={`protein-sequences-matching-${
      description[description.main.key].accession
    }-for-${accession}.fasta`}
    count={row.proteins || row.counters.extra_fields.counters.proteins}
    customLocationDescription={{
      main: { key: 'protein' },
      protein: { db: 'UniProt' },
      [description.taxonomy.isFilter ? 'taxonomy' : 'proteome']: {
        isFilter: true,
        db: 'UniProt',
        accession: `${accession}`,
      },
      [description.main.key]: {
        ...description[description.main.key],
        isFilter: true,
      },
    }}
  />
);
const AllProteinDownload = ({ description, count }) => (
  <File
    fileType="fasta"
    name={`protein-sequences-matching-${
      description[description.main.key].accession
    }.fasta`}
    count={count}
    customLocationDescription={{
      main: { key: 'protein' },
      protein: { db: 'UniProt' },
      [description.main.key]: {
        ...description[description.main.key],
        isFilter: true,
      },
    }}
  />
);
AllProteinDownload.propTypes = {
  description: T.object,
  count: T.number,
};

// List of all matches, many to many
const Matches = (
  {
    matches,
    primary,
    secondary,
    actualSize,
    isStale,
    search,
    description,
    state,
    databases,
    dbCounters,
    ...props
  } /*: {
    matches: Array<Object>,
    primary: string,
    secondary: string,
    actualSize: number,
    isStale: boolean,
    search: Object,
    description: Object,
    state: Object,
    databases: Object,
    dbCounters ?: Object,
    props: Array<any>
} */,
) => (
  <Table
    dataTable={matches.map(e => ({
      ...e[primary],
      accession: String(e[primary].accession),
      match: e,
    }))}
    actualSize={actualSize}
    query={search}
    isStale={isStale}
    notFound={matches.length === 0}
    contentType={primary}
    databases={databases}
    withTree={primary === 'taxonomy'}
    dbCounters={dbCounters}
  >
    <PageSizeSelector />
    <SearchBox />
    {description.main.key !== 'result' && (
      <Exporter>
        <ul>
          {primary === 'protein' && (
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <AllProteinDownload
                  description={description}
                  count={actualSize}
                />
              </div>
              <div>FASTA</div>
            </li>
          )}
          <li>
            <Link target="_blank" href={getUrlForApi(state)}>
              Open in API web view
            </Link>
          </li>
        </ul>
      </Exporter>
    )}
    <Column
      dataKey="accession"
      renderer={(acc /*: string */, obj /*: {source_database: string} */) => {
        const { source_database: sourceDatabase } = obj;
        return (
          // let reviewed =null;
          // if (primary === 'protein' && sourceDatabase === 'reviewed')
          //   reviewed = (
          //
          //   )
          <>
            <SchemaOrgData
              data={{ data: obj, primary, secondary }}
              processData={schemaProcessData}
            />
            <Link
              to={{
                description: {
                  main: { key: primary },
                  [primary]: { db: sourceDatabase, accession: acc },
                },
              }}
            >
              <span className={f('acc-row')}>
                <HighlightedText
                  text={acc.toUpperCase()}
                  textToHighlight={search.search}
                />
              </span>
            </Link>{' '}
            {primary === 'protein' && sourceDatabase === 'reviewed' ? (
              <Tooltip title="Reviewed by UniProt curators (Swiss-Prot)">
                <span
                  className={f('icon', 'icon-common')}
                  data-icon="&#xf00c;"
                  aria-label="reviewed"
                />
              </Tooltip>
            ) : null}
          </>
        );
      }}
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
          to={{
            description: {
              main: { key: primary },
              [primary]: { db: sourceDatabase, accession },
            },
          }}
        >
          <HighlightedText text={name} textToHighlight={search.search} />
        </Link>
      )}
    />
    <Column
      dataKey="source_organism"
      displayIf={primary === 'protein'}
      renderer={sourceOrganism =>
        sourceOrganism.taxId ? (
          <Link
            to={{
              description: {
                main: { key: 'taxonomy' },
                taxonomy: {
                  db: 'uniprot',
                  accession: `${sourceOrganism.taxId}`,
                },
              },
            }}
          >
            {sourceOrganism.fullName}
          </Link>
        ) : (
          sourceOrganism
        )
      }
    >
      Species
    </Column>
    <Column
      dataKey="source_database"
      headerClassName={f('table-center')}
      cellClassName={f('table-center')}
      displayIf={
        primary !== 'taxonomy' &&
        primary !== 'proteome' &&
        primary !== 'protein'
      }
      renderer={(db /*: string */) =>
        db === 'reviewed' ? (
          <Tooltip
            title={
              db === 'reviewed'
                ? `${db} by curators (Swiss-Prot)`
                : 'Not reviewed by curators (TrEMBL)'
            }
          >
            <span
              className={f('icon', 'icon-common')}
              data-icon="&#xf00c;"
              aria-label="reviewed"
            />
          </Tooltip>
        ) : (
          (databases && databases[db] && databases[db].name) || db
        )
      }
    >
      {primary === 'protein' ? 'Reviewed' : 'Source database'}
    </Column>
    <Column
      dataKey="accession"
      headerClassName={f('table-center')}
      cellClassName={f('table-center')}
      defaultKey="structureAccession"
      displayIf={primary === 'structure'}
      renderer={(accession /*: string */) => (
        <PDBeLink id={accession}>
          <LazyImage
            src={`//www.ebi.ac.uk/thornton-srv/databases/pdbsum/${accession}/traces.jpg`}
            alt={`structure with accession ${accession.toUpperCase()}`}
            style={{ maxWidth: '33%' }}
          />
        </PDBeLink>
      )}
    >
      Structure
    </Column>
    <Column
      dataKey="match"
      headerClassName={f('matchColumn')}
      displayIf={
        primary !== 'taxonomy' &&
        secondary !== 'taxonomy' &&
        primary !== 'proteome' &&
        secondary !== 'proteome' &&
        primary !== 'set' &&
        secondary !== 'set'
      }
      renderer={(match /*: Object */) => (
        <Lazy>
          {(hasBeenVisible /*: boolean */) =>
            hasBeenVisible ? (
              <MatchesByPrimary
                matches={[match]}
                primary={primary}
                secondary={secondary}
                {...props}
              />
            ) : null
          }
        </Lazy>
      )}
    >
      {primary === 'protein' ? 'Domain Architecture' : 'Matches'}
    </Column>
    <Column
      dataKey="counters.extra_fields.counters.proteins"
      defaultKey="protein-count"
      headerClassName={f('table-center')}
      cellClassName={f('table-center')}
      displayIf={primary === 'taxonomy' || primary === 'proteome'}
      renderer={(
        count,
        {
          accession,
          source_database: sourceDatabase,
          match: {
            [secondary]: { accession: acc, source_database: db },
          },
        },
      ) => (
        <Link
          to={{
            description: {
              main: { key: secondary },
              [secondary]: {
                accession: acc,
                db,
              },
              protein: {
                db: 'uniprot',
                order: 1,
                isFilter: true,
              },
              [primary]: {
                db: sourceDatabase,
                accession,
                order: 2,
                isFilter: true,
              },
            },
          }}
        >
          <NumberComponent abbr>{count}</NumberComponent>
        </Link>
      )}
    >
      protein count
    </Column>
    <Column
      dataKey="accession"
      defaultKey="proteinFastas"
      headerClassName={f('table-center')}
      cellClassName={f('table-center')}
      displayIf={primary === 'taxonomy' || primary === 'proteome'}
      renderer={ProteinDownloadRenderer(description)}
    >
      FASTA
    </Column>
  </Table>
);
Matches.propTypes = {
  ...propTypes,
  search: T.object.isRequired,
  description: T.object.isRequired,
  state: T.object.isRequired,
  databases: T.object.isRequired,
  dbCounters: T.object,
};

const mapStateToProps = createSelector(
  searchSelector,
  descriptionSelector,
  state => state,
  (search, description, state) => ({ search, description, state }),
);

export default connect(mapStateToProps)(Matches);
