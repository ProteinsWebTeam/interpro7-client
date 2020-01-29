/* eslint-disable react/display-name */
import React, { useEffect } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
import { toPlural } from 'utils/pages';

import EntriesOnProtein from './EntriesOnProtein';
import EntriesOnStructure from './EntriesOnStructure';
import StructureOnProtein from './StructureOnProtein';
import FileExporter from './FileExporter';
import File from 'components/File';

import Table, {
  Column,
  PageSizeSelector,
  SearchBox,
  Exporter,
} from 'components/Table';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import NumberComponent from 'components/NumberComponent';
import Lazy from 'wrappers/Lazy';
import LazyImage from 'components/LazyImage';
import loadWebComponent from 'utils/load-web-component';
import { toPublicAPI } from 'utils/url';

import { getReversedUrl } from 'higherOrder/loadData/defaults';

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

const includeAccessionSearch = (
  dataTable,
  accessionSearch,
  primary,
  secondary,
  mainData,
) => {
  const indexInPayload = dataTable.findIndex(
    ({ accession }) => accession === accessionSearch.metadata.accession,
  );
  const accMatch = {
    ...accessionSearch.metadata,
    exact: true,
    counters: {
      extra_fields: {
        counters: accessionSearch.metadata.counters,
      },
    },
    match: {
      [primary]: accessionSearch.metadata,
      [secondary]: {
        ...mainData,
        ...accessionSearch[toPlural(secondary)][0],
      },
    },
    name:
      accessionSearch.metadata.name.short ||
      accessionSearch.metadata.name.name ||
      accessionSearch.metadata.name,
  };
  if (indexInPayload >= 0) {
    dataTable.splice(indexInPayload, 1);
  }
  dataTable.splice(0, 0, accMatch);
};
// List of all matches, many to many
// eslint-disable-next-line complexity
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
    mainData,
    accessionSearch,
    currentAPICall,
    nextAPICall,
    previousAPICall,
    focusType,
    status,
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
    mainData: Object,
    accessionSearch: Object,
    focusType?: string,
    props: Array<any>
} */,
) => {
  useEffect(() => {
    loadWebComponent(() =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      ).then(m => m.InterproType),
    ).as('interpro-type');
  }, []);

  let aggSize = actualSize;
  const dataTable = matches.map(e => ({
    ...e[primary],
    accession: String(e[primary].accession),
    match: e,
  }));
  if (accessionSearch) {
    const prevSize = dataTable.length;
    includeAccessionSearch(
      dataTable,
      accessionSearch,
      primary,
      secondary,
      mainData,
    );
    aggSize += prevSize - dataTable.length;
  }

  return (
    <Table
      dataTable={dataTable}
      actualSize={aggSize}
      query={search}
      isStale={isStale}
      notFound={matches.length === 0 && !accessionSearch}
      contentType={primary}
      databases={databases}
      withTree={primary === 'taxonomy'}
      dbCounters={dbCounters}
      rowClassName={row => f({ exact: row.exact })}
      nextAPICall={nextAPICall}
      previousAPICall={previousAPICall}
      currentAPICall={currentAPICall}
      status={status}
    >
      <PageSizeSelector />
      <SearchBox loading={isStale} />
      {description.main.key !== 'result' && (
        <Exporter>
          <ul>
            {primary === 'protein' && (
              <>
                <FileExporter
                  description={description}
                  count={actualSize}
                  search={search}
                  fileType="fasta"
                  primary={primary}
                  secondary={secondary}
                />
              </>
            )}
            <FileExporter
              description={description}
              count={actualSize}
              search={search}
              fileType="tsv"
              primary={primary}
              secondary={secondary}
            />
            <FileExporter
              description={description}
              count={actualSize}
              search={search}
              fileType="json"
              primary={primary}
              secondary={secondary}
            />
            <li className={f('exporter-link')}>
              <Link target="_blank" href={toPublicAPI(getReversedUrl(state))}>
                <span
                  className={f('icon', 'icon-common', 'icon-export')}
                  data-icon="&#xf233;"
                />
                <span className={f('file-label')}>API Web View</span>
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
                  {obj.source_database === 'interpro' ? (
                    <interpro-type
                      type={obj.type.replace('_', ' ')}
                      dimension=".8em"
                    />
                  ) : null}
                  <HighlightedText text={acc} textToHighlight={search.search} />
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
        {focusType === 'taxonomy' ? 'Tax ID' : 'Accession'}
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
          <Link
            to={customLocation => ({
              ...customLocation,
              description: {
                main: { key: 'structure' },
                structure: {
                  db: customLocation.description.structure.db,
                  accession,
                },
              },
              search: {},
            })}
          >
            <LazyImage
              src={`//www.ebi.ac.uk/thornton-srv/databases/pdbsum/${accession}/traces.jpg`}
              alt={`structure with accession ${accession}`}
              style={{ maxWidth: '33%' }}
            />
          </Link>
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
        Matches
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
};
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
